import { Resend } from "resend";
import {
  getConciergeConfirmationTemplate,
  getNewsletterWelcomeTemplate,
  getUserWelcomeTemplate,
  getCircleWelcomeTemplate,
  getCircleNewCollectionTemplate,
  getPurchaseConfirmationTemplate,
  getPurchaseThankYouTemplate,
  getPasswordResetTemplate,
  getAbandonedCartTemplate,
  getSavedFavoritesTemplate,
} from "../lib/email/templates/index.js";

const apiKey = process.env.RESEND_API_KEY;
const resend = new Resend(apiKey);

const recipients = ["emilcastle2608@gmail.com"];
const sender = "Minerva Alcaraz <onboarding@resend.dev>";

const name = "E-vior Developments";

const emails = [
  {
    subject: "✨ Solicitud de Co-Creación Recibida · MA-CON-8492 💎",
    html: getConciergeConfirmationTemplate({
      contactName: name,
      contactEmail: "eviordevelopments@gmail.com",
      description: "Anillo en plata .925 esculpido a mano con incrustación de cuarzo místico y grabado interior en caligrafía antigua.",
      requestNumber: "MA-CON-8492",
    }),
  },
  {
    subject: "🌹 Bienvenido a la Herencia · Minerva Alcaraz ✨",
    html: getNewsletterWelcomeTemplate({
      email: "eviordevelopments@gmail.com",
    }),
  },
  {
    subject: `🕊️ Bienvenido a Minerva Alcaraz, ${name} ✨`,
    html: getUserWelcomeTemplate({
      name,
    }),
  },
  {
    subject: "👑 Bienvenido a THE CIRCLE · Cofradía de Élite 💎",
    html: getCircleWelcomeTemplate({
      name,
    }),
  },
  {
    subject: "✨ Preestreno Exclusivo con Fotografía: Colección Amatista · THE CIRCLE 👑",
    html: getCircleNewCollectionTemplate({
      name,
      collectionName: "Colección Amatista",
      previewUrl: "https://minervaalcarazjoyeria.mx/colecciones",
    }),
  },
  {
    subject: "💎 Confirmación de Compra · Orden MA-ORD-1001 ✨",
    html: getPurchaseConfirmationTemplate({
      customerName: name,
      orderId: "MA-ORD-1001",
      items: [
        { name: "Anillo Amatista de Luz", price: 3800, quantity: 1 },
        { name: "Medallón Chai Ancestral", price: 5200, quantity: 1 },
      ],
      totalAmount: 9000,
    }),
  },
  {
    subject: "🌹 Gracias por tu Compra · Guía del Ritual de Cuidado ✨",
    html: getPurchaseThankYouTemplate({
      customerName: name,
    }),
  },
  {
    subject: "🔑 Restablecer Contraseña · Minerva Alcaraz 🛡️",
    html: getPasswordResetTemplate({
      name,
      resetUrl: "https://minervaalcarazjoyeria.mx/auth/reset",
    }),
  },
  {
    subject: "🛒 Tus Piezas en el Atelier te Esperan · Minerva Alcaraz ✨",
    html: getAbandonedCartTemplate({
      customerName: name,
    }),
  },
  {
    subject: "💖 Tus Piezas Favoritas Guardadas en el Atelier · Minerva Alcaraz ✨",
    html: getSavedFavoritesTemplate({
      customerName: name,
    }),
  },
];

async function sendAllTestEmails() {
  for (const recipient of recipients) {
    console.log(`✉️ Enviando muestras de las 10 plantillas a ${recipient}...`);

    for (let i = 0; i < emails.length; i++) {
      const item = emails[i];
      try {
        const res = await resend.emails.send({
          from: sender,
          to: recipient,
          subject: item.subject,
          html: item.html,
        });
        console.log(`✅ [${i + 1}/10] Enviado: "${item.subject}" (ID: ${res.data?.id || "OK"})`);
      } catch (err) {
        console.error(`❌ [${i + 1}/10] Error enviando "${item.subject}":`, err.message || err);
      }
    }
  }

  console.log(`\n🎉 ¡Las 10 plantillas de correo fueron enviadas exitosamente!`);
}

sendAllTestEmails();
