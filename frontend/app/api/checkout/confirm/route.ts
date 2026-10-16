import { NextRequest, NextResponse } from "next/server";
import { fulfillOrder } from "../../../../lib/orders/fulfillment";

export async function POST(req: NextRequest) {
  try {
    const { paymentIntentId, orderId } = await req.json();

    if (!paymentIntentId && !orderId) {
      return NextResponse.json(
        { error: "paymentIntentId u orderId son requeridos" },
        { status: 400 }
      );
    }

    const result = await fulfillOrder({
      paymentIntentId,
      orderId,
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "No se pudo completar el procesamiento de la orden" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      orderId: result.orderId,
      orderNumber: result.orderNumber,
      alreadyFulfilled: result.alreadyFulfilled || false,
      emailsSent: result.emailsSent || false,
    });
  } catch (err: unknown) {
    console.error("[POST /api/checkout/confirm error]:", err);
    const message = err instanceof Error ? err.message : "Error interno del servidor";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
