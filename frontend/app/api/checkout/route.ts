import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2024-04-10" as any, // Using a stable API version
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { items, shippingDetails } = body;

    // Validate request
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "El carrito está vacío." },
        { status: 400 }
      );
    }

    // In a real application, you MUST validate the prices of the items against your database here
    // to prevent users from manipulating the prices on the client side.
    // For this example, we'll calculate the total based on the received items,
    // assuming they are trusted or validated elsewhere in a real scenario.
    
    // Calculate total in cents (Stripe expects the smallest currency unit)
    const amount = items.reduce(
      (total: number, item: any) => total + item.price * item.quantity,
      0
    ) * 100; // Multiply by 100 to convert to centavos for MXN

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: "mxn",
      // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        customer_email: shippingDetails?.email,
        customer_name: shippingDetails?.name,
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error: any) {
    console.error("Stripe Checkout Error:", error);
    return NextResponse.json(
      { error: error.message || "Error al procesar el pago." },
      { status: 500 }
    );
  }
}
