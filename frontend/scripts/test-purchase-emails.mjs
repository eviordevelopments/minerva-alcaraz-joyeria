import { Resend } from "resend";
import {
  getPurchaseConfirmationTemplate,
  getAdminPurchaseNotificationTemplate,
  getOrderDeliveredTemplate,
} from "../lib/email/templates/index.js";

const apiKey = process.env.RESEND_API_KEY;
const resend = new Resend(apiKey);

const recipient = "emilcastle2608@gmail.com";
const sender = "Minerva Alcaraz <onboarding@resend.dev>";

const name = "Emiliano Castillo";
const orderId = "MA-ORD-9999";

const emails = [
  {
    subject: `💎 Confirmación de Compra · Orden ${orderId} ✨`,
    html: getPurchaseConfirmationTemplate({
      customerName: name,
      orderId,
      items: [
        { 
          name: "Anillo Amatista de Luz", 
          price: 3800, 
          quantity: 1,
          image: "https://res.cloudinary.com/dlsc3ova5/image/upload/f_auto,q_auto,w_400/v1778275655/minerva_joyeria/products/ebano/EBANO.jpg"
        },
        { 
          name: "Medallón Chai Ancestral", 
          price: 5200, 
          quantity: 2,
          image: "https://res.cloudinary.com/dlsc3ova5/image/upload/f_auto,q_auto,w_400/v1778275655/minerva_joyeria/products/chai/CHAI.jpg"
        },
      ],
      totalAmount: 14200,
    }),
  },
  {
    subject: `💰 Nueva Compra Recibida - Orden ${orderId}`,
    html: getAdminPurchaseNotificationTemplate({
      orderId,
      customerName: name,
      customerEmail: recipient,
      totalAmount: 14200,
      items: [
        { name: "Anillo Amatista de Luz", quantity: 1 },
        { name: "Medallón Chai Ancestral", quantity: 2 },
      ]
    })
  },
  {
    subject: `📦 Tu Pedido de Minerva Alcaraz ha sido entregado ✨`,
    html: getOrderDeliveredTemplate({
      customerName: name,
      orderId
    })
  }
];

async function sendTestEmails() {
  console.log(`✉️ Enviando muestras de las plantillas de compra a ${recipient}...`);

  for (let i = 0; i < emails.length; i++) {
    const item = emails[i];
    try {
      const res = await resend.emails.send({
        from: sender,
        to: recipient,
        subject: item.subject,
        html: item.html,
      });
      console.log(`✅ [${i + 1}/${emails.length}] Enviado: "${item.subject}" (ID: ${res.data?.id || "OK"})`);
    } catch (err) {
      console.error(`❌ [${i + 1}/${emails.length}] Error enviando "${item.subject}":`, err.message || err);
    }
  }

  console.log(`\n🎉 ¡Las plantillas de compra fueron enviadas exitosamente!`);
}

sendTestEmails();
