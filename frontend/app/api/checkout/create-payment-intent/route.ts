import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

// Stripe keys checked at runtime

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-06-20" as any,
});

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const { items, userId, isTheCircleMember, shippingDetails, customerNotes } = await req.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "El carrito está vacío" }, { status: 400 });
    }

    // 1. Fetch real prices from Supabase
    const productIds = items.map((i: any) => i.productId);
    const isUUID = (str: string) =>
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(str);
    const validUuids = productIds.filter(isUUID);
    const skus = items.map((i: any) => i.sku).filter(Boolean);

    let dbProducts: any[] = [];
    let initialQuery = supabaseAdmin
      .from("products")
      .select("id, name, sku, price_cents, images, collection_name, materials, requires_shipping, dimensions_mm");

    if (validUuids.length > 0 && skus.length > 0) {
      initialQuery = initialQuery.or(`id.in.(${validUuids.join(",")}),sku.in.(${skus.map((s: string) => `"${s}"`).join(",")})`);
    } else if (validUuids.length > 0) {
      initialQuery = initialQuery.in("id", validUuids);
    } else if (skus.length > 0) {
      initialQuery = initialQuery.in("sku", skus);
    }

    const { data: initialProds, error: prodError } = await initialQuery;

    if (prodError && (prodError.message?.includes("requires_shipping") || prodError.code === "42703" || prodError.code === "PGRST204")) {
      let fallbackQuery = supabaseAdmin
        .from("products")
        .select("id, name, sku, price_cents, images, collection_name, materials, dimensions_mm");

      if (validUuids.length > 0 && skus.length > 0) {
        fallbackQuery = fallbackQuery.or(`id.in.(${validUuids.join(",")}),sku.in.(${skus.map((s: string) => `"${s}"`).join(",")})`);
      } else if (validUuids.length > 0) {
        fallbackQuery = fallbackQuery.in("id", validUuids);
      } else if (skus.length > 0) {
        fallbackQuery = fallbackQuery.in("sku", skus);
      }

      const { data: fallbackProds, error: fallbackErr } = await fallbackQuery;
      if (fallbackErr || !fallbackProds || fallbackProds.length === 0) {
        return NextResponse.json({ error: "Error al verificar productos" }, { status: 404 });
      }
      dbProducts = fallbackProds;
    } else if (prodError || !initialProds || initialProds.length === 0) {
      return NextResponse.json({ error: "Error al verificar productos" }, { status: 404 });
    } else {
      dbProducts = initialProds;
    }

    let subtotalCents = 0;
    const orderItemsToInsert: any[] = [];

    // Calculate subtotal securely
    for (const item of items) {
      const dbProduct = dbProducts.find(
        (p) =>
          p.id === item.productId ||
          p.sku === item.sku ||
          (p.name && item.name && p.name.trim().toLowerCase() === item.name.trim().toLowerCase())
      );
      if (!dbProduct) continue;

      const unitPrice = dbProduct.price_cents;
      const quantity = item.quantity || 1;
      const itemSubtotal = unitPrice * quantity;
      
      subtotalCents += itemSubtotal;

      orderItemsToInsert.push({
        product_id: dbProduct.id,
        product_name: dbProduct.name,
        product_sku: dbProduct.sku,
        product_image: dbProduct.images?.[0] || null,
        collection_name: dbProduct.collection_name,
        materials: dbProduct.materials,
        unit_price_cents: unitPrice,
        quantity: quantity,
        subtotal_cents: itemSubtotal,
        size_requested: item.size || null,
      });
    }

    let discountCents = 0;

    // Check if it's their first purchase
    if (userId) {
      const { data: pastOrders, error: pastOrdersError } = await supabaseAdmin
        .from("orders")
        .select("id")
        .eq("user_id", userId)
        .in("status", ["paid", "completed", "shipped", "delivered"]);
        
      if (!pastOrdersError && (!pastOrders || pastOrders.length === 0)) {
        // First purchase! Apply 10% discount on the subtotal.
        discountCents = Math.round(subtotalCents * 0.10);
      }
    }

    if (subtotalCents === 0) {
      return NextResponse.json({ error: "El total es 0" }, { status: 400 });
    }

    // 2. Calculate Shipping & IVA
    // Check if shipping is deactivated manually on all products in cart
    const allShippingDisabled =
      items.length > 0 &&
      items.every((item: any) => {
        const dbP = dbProducts.find(
          (p: any) =>
            p.id === item.productId ||
            p.sku === item.sku ||
            (p.name && item.name && p.name.trim().toLowerCase() === item.name.trim().toLowerCase())
        );
        if (!dbP) return item.requires_shipping === false;
        const req =
          dbP.requires_shipping !== undefined && dbP.requires_shipping !== null
            ? dbP.requires_shipping
            : dbP.dimensions_mm?.requires_shipping !== undefined
            ? dbP.dimensions_mm.requires_shipping
            : true;
        return req === false;
      });

    const rawSubtotalMxn = subtotalCents / 100;
    let shippingCostMxn = 200;
    if (allShippingDisabled) {
      shippingCostMxn = 0;
    } else if (isTheCircleMember && rawSubtotalMxn >= 2000) {
      shippingCostMxn = 0;
    } else if (!isTheCircleMember && rawSubtotalMxn >= 5000) {
      shippingCostMxn = 0;
    }
    const shippingCents = shippingCostMxn * 100;
    
    // In Mexico (PROFECO) and Minerva Alcaraz catalog, prices already include 16% IVA.
    // We break down the tax for accounting/receipts, but DO NOT add it on top of the total.
    const taxableAmount = subtotalCents - discountCents;
    const taxCents = Math.round(taxableAmount - (taxableAmount / 1.16));
    
    // Total is subtotal (with discount) + shipping
    const totalCents = taxableAmount + shippingCents;

    // 3. Create Draft Order in Database
    const customerEmail = shippingDetails?.email || "";
    const customerName = shippingDetails?.name || "";
    const orderNumber = `MA-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const orderInsertData: Record<string, any> = {
      order_number: orderNumber,
      user_id: userId || null,
      status: "pending",
      payment_method: "card",
      subtotal_cents: subtotalCents,
      discount_cents: discountCents,
      shipping_cents: shippingCents,
      tax_cents: taxCents,
      total_cents: totalCents,
      currency: "MXN",
      shipping_name: customerName,
      shipping_email: customerEmail,
      shipping_phone: shippingDetails?.phone || "",
      shipping_street: shippingDetails?.address || "",
      shipping_city: shippingDetails?.city || "",
      shipping_postal_code: shippingDetails?.postal || "",
      shipping_country: "México",
      customer_notes: customerNotes || "",
    };

    let { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .insert(orderInsertData)
      .select()
      .single();

    if (orderError || !order) {
      throw new Error(`Failed to create order: ${orderError?.message}`);
    }

    // Attach order_id and insert order items
    for (const oi of orderItemsToInsert) {
      oi.order_id = order.id;
    }
    await supabaseAdmin.from("order_items").insert(orderItemsToInsert);

    // 4. Create Stripe PaymentIntent with customer metadata for resilient email receipt
    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalCents,
      currency: "mxn",
      receipt_email: customerEmail || undefined,
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        orderId: order.id,
        orderNumber: order.order_number,
        isTheCircleMember: String(!!isTheCircleMember),
        customer_email: customerEmail,
        customer_name: customerName,
      },
    });

    // Update order with payment reference
    await supabaseAdmin
      .from("orders")
      .update({ payment_reference: paymentIntent.id })
      .eq("id", order.id);

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      breakdown: {
        subtotalCents,
        discountCents,
        shippingCents,
        taxCents,
        totalCents
      }
    });

  } catch (err: unknown) {
    console.error("[Stripe PaymentIntent Error]:", err);
    const message = err instanceof Error ? err.message : "Error interno del servidor";

    try {
      const { sendAnomalyAlert } = await import("../../../../lib/monitoring/alerts");
      await sendAnomalyAlert({
        type: "ORDER_ERROR",
        error: message,
      });
    } catch (_) {}

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
