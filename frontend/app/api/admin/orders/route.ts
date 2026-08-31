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
        placed_at,
        shipping_state,
        shipping_country,
        profiles (
          full_name,
          email
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
