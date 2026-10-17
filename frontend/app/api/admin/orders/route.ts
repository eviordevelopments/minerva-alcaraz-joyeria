import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  try {
    const { data: orders, error } = await supabaseAdmin
      .from("orders")
      .select(`
        id,
        order_number,
        status,
        payment_method,
        total_cents,
        subtotal_cents,
        shipping_cents,
        discount_cents,
        placed_at,
        created_at,
        shipping_name,
        shipping_email,
        shipping_phone,
        shipping_street,
        shipping_city,
        shipping_state,
        shipping_postal_code,
        shipping_country,
        customer_notes,
        profiles (
          full_name,
          email,
          phone
        ),
        order_items (
          id,
          product_name,
          product_sku,
          product_image,
          quantity,
          unit_price_cents,
          subtotal_cents,
          size_requested
        )
      `)
      .order("placed_at", { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json({ orders });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
