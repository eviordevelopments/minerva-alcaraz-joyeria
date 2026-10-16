import { sendEmail } from "../email/resend";

export interface AnomalyAlertPayload {
  type: "PAYMENT_FAILED" | "FULFILLMENT_ERROR" | "WEBHOOK_ERROR" | "DATA_MISMATCH" | "ORDER_ERROR";
  orderId?: string;
  orderNumber?: string;
  paymentIntentId?: string;
  customerName?: string;
  customerEmail?: string;
  error: string;
  details?: Record<string, any>;
}

const ALERT_RECIPIENTS = [
  "eviordevelopments@gmail.com",
  "minerva.alcaraz.joyeria@gmail.com",
];

/**
 * Dispatches an immediate high-priority alert email to eviordevelopments@gmail.com
 * and the admin panel when an anomaly is detected in any purchase flow.
 */
export async function sendAnomalyAlert(payload: AnomalyAlertPayload) {
  try {
    const timestamp = new Date().toLocaleString("es-MX", { timeZone: "America/Mexico_City" });
    const orderRef = payload.orderNumber || payload.orderId || "Sin ID registrado";

    const subject = `🚨 ANOMALÍA EN COMPRA · Orden ${orderRef} · Minerva Alcaraz Joyería`;

    const htmlContent = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 650px; margin: 0 auto; background-color: #1F271D; color: #E5DBD6; border: 1px solid #CBB67B; padding: 25px;">
        <div style="border-bottom: 1px solid rgba(203, 182, 123, 0.3); padding-bottom: 15px; margin-bottom: 20px;">
          <span style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.3em; color: #EF4444; font-weight: bold;">
            Sistema de Monitoreo de Transacciones
          </span>
          <h2 style="color: #E5DBD6; margin: 8px 0 0 0; font-size: 22px;">
            Alerta de Anomalía en Proceso de Compra
          </h2>
          <span style="font-size: 11px; color: #8E9A8B; font-family: monospace;">${timestamp} (Hora de México)</span>
        </div>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 13px;">
          <tr style="border-bottom: 1px solid rgba(229, 219, 214, 0.1);">
            <td style="padding: 8px 0; color: #CBB67B; font-weight: bold; width: 35%;">Tipo de Anomalía:</td>
            <td style="padding: 8px 0; font-family: monospace; color: #F87171;">${payload.type}</td>
          </tr>
          <tr style="border-bottom: 1px solid rgba(229, 219, 214, 0.1);">
            <td style="padding: 8px 0; color: #CBB67B; font-weight: bold;">ID de Compra / Orden:</td>
            <td style="padding: 8px 0; font-family: monospace; font-weight: bold; color: #E5DBD6;">${orderRef}</td>
          </tr>
          ${payload.paymentIntentId ? `
          <tr style="border-bottom: 1px solid rgba(229, 219, 214, 0.1);">
            <td style="padding: 8px 0; color: #CBB67B; font-weight: bold;">Stripe PaymentIntent:</td>
            <td style="padding: 8px 0; font-family: monospace; color: #E5DBD6;">${payload.paymentIntentId}</td>
          </tr>` : ""}
          ${payload.customerName || payload.customerEmail ? `
          <tr style="border-bottom: 1px solid rgba(229, 219, 214, 0.1);">
            <td style="padding: 8px 0; color: #CBB67B; font-weight: bold;">Cliente:</td>
            <td style="padding: 8px 0; color: #E5DBD6;">${payload.customerName || "N/A"} &lt;${payload.customerEmail || "N/A"}&gt;</td>
          </tr>` : ""}
        </table>

        <div style="background-color: rgba(239, 68, 68, 0.1); border-left: 3px solid #EF4444; padding: 15px; margin-bottom: 20px;">
          <div style="font-size: 11px; text-transform: uppercase; color: #EF4444; font-weight: bold; margin-bottom: 5px;">Detalle del Error:</div>
          <div style="font-family: monospace; font-size: 12px; color: #FECACA; word-break: break-all;">
            ${payload.error}
          </div>
        </div>

        ${payload.details ? `
        <div style="background-color: #2C3729; border: 1px solid rgba(203, 182, 123, 0.2); padding: 15px; margin-bottom: 20px;">
          <div style="font-size: 11px; text-transform: uppercase; color: #CBB67B; font-weight: bold; margin-bottom: 8px;">Metadatos y Contexto:</div>
          <pre style="margin: 0; font-size: 11px; font-family: monospace; color: #8E9A8B; overflow-x: auto;">${JSON.stringify(payload.details, null, 2)}</pre>
        </div>` : ""}

        <div style="text-align: center; margin-top: 25px; padding-top: 15px; border-top: 1px solid rgba(203, 182, 123, 0.2);">
          <a href="https://minervaalcarazjoyeria.mx/admin/pedidos" style="display: inline-block; background-color: #CBB67B; color: #1F271D; padding: 10px 20px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.2em; text-decoration: none; font-weight: bold;">
            Abrir Panel de Pedidos
          </a>
        </div>
      </div>
    `;

    for (const recipient of ALERT_RECIPIENTS) {
      await sendEmail({
        to: recipient,
        subject,
        html: htmlContent,
      });
    }

    console.log(`[AnomalyAlert] Alert successfully dispatched to ${ALERT_RECIPIENTS.join(", ")} for order ${orderRef}`);
  } catch (err: any) {
    console.error("[AnomalyAlert] Failed to send anomaly alert email:", err?.message || err);
  }
}
