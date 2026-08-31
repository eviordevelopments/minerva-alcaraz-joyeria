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
    const { data: dbProducts, error: prodError } = await supabaseAdmin
      .from("products")
      .select("id, name, sku, price_cents, images, collection_name, materials")
      .in("id", productIds);

    if (prodError || !dbProducts || dbProducts.length === 0) {
      return NextResponse.json({ error: "Error al verificar productos" }, { status: 404 });
    }

    let subtotalCents = 0;
    const orderItemsToInsert: any[] = [];

    // Calculate subtotal securely
    for (const item of items) {
      const dbProduct = dbProducts.find((p) => p.id === item.productId);
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

    if (subtotalCents === 0) {
      return NextResponse.json({ error: "El total es 0" }, { status: 400 });
    }

    // 2. Calculate Shipping & IVA
    // Free for THE CIRCLE, else 500 MXN
    const shippingCents = isTheCircleMember ? 0 : 50000;
    
    // IVA is 16% on top
    const taxableAmount = subtotalCents + shippingCents;
    const taxCents = Math.round(taxableAmount * 0.16);
    
    const totalCents = taxableAmount + taxCents;

    // 3. Create Draft Order in Database
    const orderNumber = `MA-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .insert({
        order_number: orderNumber,
        user_id: userId || null,
        status: "pending",
        payment_method: "card",
        subtotal_cents: subtotalCents,
        shipping_cents: shippingCents,
        tax_cents: taxCents,
        total_cents: totalCents,
        currency: "MXN",
        shipping_name: shippingDetails?.name || "",
        shipping_phone: shippingDetails?.phone || "",
        shipping_street: shippingDetails?.address || "",
        shipping_city: shippingDetails?.city || "",
        shipping_postal_code: shippingDetails?.postal || "",
        shipping_country: "México",
        customer_notes: customerNotes || "",
      })
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

    // 4. Create Stripe PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalCents,
      currency: "mxn",
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        orderId: order.id,
        isTheCircleMember: String(!!isTheCircleMember),
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
        shippingCents,
        taxCents,
        totalCents
      }
    });

  } catch (err: unknown) {
    console.error("[Stripe PaymentIntent Error]:", err);
    const message = err instanceof Error ? err.message : "Error interno del servidor";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
