import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "../../../../lib/email/resend";
import {
  getUserWelcomeTemplate,
  getCircleWelcomeTemplate,
  getCircleNewCollectionTemplate,
  getPurchaseConfirmationTemplate,
  getPurchaseThankYouTemplate,
  getPasswordResetTemplate,
  getAbandonedCartTemplate,
  getSavedFavoritesTemplate,
} from "../../../../lib/email/templates";

export async function POST(req: NextRequest) {
  try {
    const { type, payload } = await req.json();

    if (!type || !payload || !payload.to) {
      return NextResponse.json({ error: "Tipo de correo y destinatario son requeridos." }, { status: 400 });
    }

    let html = "";
    let subject = "";

    switch (type) {
      case "user_welcome":
        subject = `🕊️ Bienvenido a Minerva Alcaraz, ${payload.name || "Cliente"} ✨`;
        html = getUserWelcomeTemplate({ name: payload.name || "Estimado(a) Cliente" });
        break;

      case "circle_welcome":
        subject = "👑 Bienvenido a THE CIRCLE · Cofradía de Élite 💎";
        html = getCircleWelcomeTemplate({ name: payload.name || "Estimado(a) Cliente" });
        break;

      case "circle_new_collection":
        subject = `✨ Preestreno Exclusivo: ${payload.collectionName || "Nuevas Piezas"} · THE CIRCLE 👑`;
        html = getCircleNewCollectionTemplate({
          name: payload.name || "Estimado(a) Miembro",
          collectionName: payload.collectionName || "Nueva Colección",
          previewUrl: payload.previewUrl || "https://minervaalcarazjoyeria.mx/colecciones",
        });
        break;

      case "purchase_confirmation":
        subject = `💎 Confirmación de Compra · Orden ${payload.orderId || "MA-ORD-1001"} ✨`;
        html = getPurchaseConfirmationTemplate({
          customerName: payload.name || "Cliente",
          orderId: payload.orderId || "MA-ORD-1001",
          items: payload.items || [],
          totalAmount: payload.totalAmount || 0,
        });
        break;

      case "purchase_thank_you":
        subject = "🌹 Gracias por tu Compra · Guía del Ritual de Cuidado ✨";
        html = getPurchaseThankYouTemplate({ customerName: payload.name || "Cliente" });
        break;

      case "password_reset":
        subject = "🔑 Restablecer Contraseña · Minerva Alcaraz 🛡️";
        html = getPasswordResetTemplate({
          name: payload.name || "Cliente",
          resetUrl: payload.resetUrl || "https://minervaalcarazjoyeria.mx/auth/reset",
        });
        break;

      case "abandoned_cart":
        subject = "🛒 Tus Piezas en el Atelier te Esperan · Minerva Alcaraz ✨";
        html = getAbandonedCartTemplate({
          customerName: payload.name || "Cliente",
          items: payload.items,
          cartUrl: payload.cartUrl || "https://minervaalcarazjoyeria.mx/cart",
        });
        break;

      case "saved_favorites":
        subject = "💖 Tus Piezas Favoritas Guardadas en el Atelier · Minerva Alcaraz ✨";
        html = getSavedFavoritesTemplate({
          customerName: payload.name || "Cliente",
          items: payload.items,
          favoritesUrl: payload.favoritesUrl || "https://minervaalcarazjoyeria.mx/favorites",
        });
        break;

      default:
        return NextResponse.json({ error: `Tipo de correo '${type}' no soportado.` }, { status: 400 });
    }

    const resendResponse = await sendEmail({
      to: payload.to,
      subject,
      html,
    });

    return NextResponse.json({ success: true, resendResponse });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error enviando correo.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
