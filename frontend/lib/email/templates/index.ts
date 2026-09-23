import { wrapBaseEmailTemplate } from "./baseLayout";

const BRAND_ESSENCE_QUOTE = `&ldquo;Creamos para que puedas expresar lo que sientes. Cada pieza es una forma de amor, identidad y conexión con quienes más importan.&rdquo;`;

const BRAND_SIGNATURE = `
  <div style="margin-top: 35px; pt: 15px; font-family: 'Cormorant Garamond', Georgia, serif; font-style: italic; font-size: 16px; color: #CBB67B;">
    Con amor,<br/>
    <strong style="font-weight: 500; font-size: 18px; color: #E5DBD6; font-style: normal; font-family: 'Cormorant Garamond', Georgia, serif;">Minerva Alcaraz</strong>
  </div>
`;

/**
 * 1. Concierge / Co-Creación Form Submission Receipt (Sent to Client & Atelier copy)
 */
export function getConciergeConfirmationTemplate({
  contactName,
  contactEmail,
  description,
  requestNumber,
}: {
  contactName: string;
  contactEmail: string;
  description: string;
  requestNumber: string;
}) {
  const contentHtml = `
    <div style="text-align: center; margin-bottom: 25px;">
      <span style="font-size: 9px; letter-spacing: 0.4em; color: #CBB67B; text-transform: uppercase;">Co-Creación &amp; Atelier</span>
      <h2 style="font-size: 26px; color: #E5DBD6; font-style: italic; font-weight: 300; margin: 10px 0; font-family: 'Cormorant Garamond', Georgia, serif;">Solicitud Recibida</h2>
      <div style="font-family: monospace; font-size: 11px; color: #CBB67B; letter-spacing: 0.2em;">${requestNumber}</div>
    </div>

    <p style="font-size: 14px; line-height: 1.8; color: #E5DBD6; font-weight: 300;">
      Estimado(a) <strong>${contactName}</strong>,
    </p>
    
    <p style="font-size: 13px; line-height: 1.8; color: rgba(229, 219, 214, 0.9); font-weight: 300; font-style: italic; font-family: 'Cormorant Garamond', Georgia, serif; text-align: center; border-left: 2px solid #CBB67B; padding-left: 15px; margin: 20px 0;">
      ${BRAND_ESSENCE_QUOTE}
    </p>

    <p style="font-size: 12px; line-height: 1.8; color: rgba(229, 219, 214, 0.85);">
      Es un honor recibir tu mensaje. Toda gran obra comienza con un suspiro de inspiración, y nos llena de alegría que desees plasmar un momento único en una joya de autor.
    </p>

    <div style="background-color: rgba(31, 39, 29, 0.6); border: 1px solid rgba(203, 182, 123, 0.3); padding: 22px; margin: 25px 0;">
      <div style="font-size: 9px; letter-spacing: 0.3em; color: #CBB67B; text-transform: uppercase; margin-bottom: 8px;">Descripción de tu Joya</div>
      <p style="font-size: 12px; line-height: 1.6; color: #E5DBD6; margin: 0; font-style: italic; font-family: 'Cormorant Garamond', Georgia, serif;">
        &ldquo;${description}&rdquo;
      </p>
    </div>

    <p style="font-size: 12px; line-height: 1.8; color: rgba(229, 219, 214, 0.8);">
      Nuestro equipo de maestros joyeros en nuestro Atelier de <strong>San Miguel de Allende</strong> revisará tu visión detalladamente y te contactará en un plazo máximo de <strong>24 horas hábiles</strong> para agendar tu sesión personalizada.
    </p>

    <div style="text-align: center; margin-top: 30px;">
      <a href="https://minervaalcarazjoyeria.mx/personalized" class="btn">Ver Mi Estado de Solicitud</a>
    </div>

    ${BRAND_SIGNATURE}
  `;

  return wrapBaseEmailTemplate({
    title: `✨ Solicitud de Co-Creación Recibida · ${requestNumber} 💎`,
    preheader: `Hemos recibido tu solicitud de co-creación en Minerva Alcaraz.`,
    contentHtml,
  });
}

/**
 * 2. Welcome to Newsletter Subscribers
 */
export function getNewsletterWelcomeTemplate({ email }: { email: string }) {
  const contentHtml = `
    <div style="text-align: center; margin-bottom: 25px;">
      <span style="font-size: 9px; letter-spacing: 0.4em; color: #CBB67B; text-transform: uppercase;">Suscripción Confirmada</span>
      <h2 style="font-size: 26px; color: #E5DBD6; font-style: italic; font-weight: 300; margin: 10px 0; font-family: 'Cormorant Garamond', Georgia, serif;">Bienvenido a THE CIRCLE</h2>
    </div>

    <p style="font-size: 14px; line-height: 1.8; color: rgba(229, 219, 214, 0.9); font-weight: 300; font-style: italic; text-align: center; font-family: 'Cormorant Garamond', Georgia, serif; border-left: 2px solid #CBB67B; padding-left: 15px; margin: 20px 0;">
      ${BRAND_ESSENCE_QUOTE}
    </p>

    <p style="font-size: 12px; line-height: 1.8; color: rgba(229, 219, 214, 0.85); text-align: center;">
      Tu correo electrónico (<strong>${email}</strong>) ha sido inscrito en nuestro registro privado de San Miguel de Allende. A partir de hoy, recibirás de primera mano la historia de nuestras piezas cápsula y revelaciones de gemas extraordinarias.
    </p>

    <div style="text-align: center; margin-top: 30px;">
      <a href="https://minervaalcarazjoyeria.mx/colecciones" class="btn">Explorar Colecciones</a>
    </div>

    ${BRAND_SIGNATURE}
  `;

  return wrapBaseEmailTemplate({
    title: "🌹 Bienvenido a THE CIRCLE · Minerva Alcaraz ✨",
    preheader: "Tu acceso privado a piezas exclusivas e historia de orfebrería.",
    contentHtml,
  });
}

/**
 * 3. Welcome to New Registered Users
 */
export function getUserWelcomeTemplate({ name }: { name: string }) {
  const contentHtml = `
    <div style="text-align: center; margin-bottom: 25px;">
      <span style="font-size: 9px; letter-spacing: 0.4em; color: #CBB67B; text-transform: uppercase;">Cuenta Creada</span>
      <h2 style="font-size: 26px; color: #E5DBD6; font-style: italic; font-weight: 300; margin: 10px 0; font-family: 'Cormorant Garamond', Georgia, serif;">Bienvenido a Nuestra Casa Digital</h2>
    </div>

    <p style="font-size: 14px; line-height: 1.8; color: #E5DBD6;">
      Hola <strong>${name}</strong>,
    </p>
    
    <p style="font-size: 13px; line-height: 1.8; color: rgba(229, 219, 214, 0.9); font-weight: 300; font-style: italic; font-family: 'Cormorant Garamond', Georgia, serif; border-left: 2px solid #CBB67B; padding-left: 15px; margin: 20px 0;">
      ${BRAND_ESSENCE_QUOTE}
    </p>

    <p style="font-size: 12px; line-height: 1.8; color: rgba(229, 219, 214, 0.85); font-weight: 300;">
      Es un absoluto placer recibirte. Tu perfil ha sido activado y desde ahora podrás guardar tus joyas predilectas, acompañar el proceso de tus piezas personalizadas y seguir de cerca cada uno de tus pedidos.
    </p>

    <div style="text-align: center; margin-top: 30px;">
      <a href="https://minervaalcarazjoyeria.mx/auth" class="btn">Iniciar Sesión en Mi Cuenta</a>
    </div>

    ${BRAND_SIGNATURE}
  `;

  return wrapBaseEmailTemplate({
    title: `🕊️ Bienvenido a Minerva Alcaraz, ${name} ✨`,
    preheader: "Tu cuenta ha sido creada exitosamente en Minerva Alcaraz.",
    contentHtml,
  });
}

/**
 * 4. Welcome to THE CIRCLE Membership
 */
export function getCircleWelcomeTemplate({ name }: { name: string }) {
  const contentHtml = `
    <div style="text-align: center; margin-bottom: 25px;">
      <span style="font-size: 9px; letter-spacing: 0.5em; color: #CBB67B; text-transform: uppercase;">Cofradía de Élite</span>
      <h2 style="font-size: 28px; color: #CBB67B; font-style: italic; font-weight: 300; margin: 10px 0; font-family: 'Cormorant Garamond', Georgia, serif;">Bienvenido a THE CIRCLE</h2>
    </div>

    <p style="font-size: 14px; line-height: 1.8; color: #E5DBD6;">
      Estimado(a) <strong>${name}</strong>,
    </p>
    
    <p style="font-size: 14px; line-height: 1.8; color: rgba(229, 219, 214, 0.9); font-weight: 300; font-style: italic; font-family: 'Cormorant Garamond', Georgia, serif; border-left: 2px solid #CBB67B; padding-left: 15px; margin: 20px 0;">
      ${BRAND_ESSENCE_QUOTE}
    </p>

    <p style="font-size: 12px; line-height: 1.8; color: rgba(229, 219, 214, 0.85);">
      Elevar la experiencia de la orfebrería a su máxima expresión es un privilegio reservado para unos cuantos. Has ingresado oficialmente a <strong>THE CIRCLE</strong>.
    </p>

    <div style="background-color: rgba(31, 39, 29, 0.8); border: 1px solid #CBB67B; padding: 22px; margin: 25px 0;">
      <div style="font-size: 9px; letter-spacing: 0.3em; color: #CBB67B; text-transform: uppercase; margin-bottom: 12px;">Tus Privilegios Exclusivos:</div>
      <ul style="margin: 0; padding-left: 20px; font-size: 11px; color: #E5DBD6; line-height: 1.9;">
        <li>Concierge dedicado personal y atención directa con maestros artesanos.</li>
        <li>Acceso prioritario 48 horas antes de lanzamientos públicos.</li>
        <li>Invitaciones privadas a exhibiciones y catas de gemas en San Miguel de Allende.</li>
        <li>Garantía vitalicia de autenticidad y rituales de mantenimiento anual sin costo.</li>
      </ul>
    </div>

    <div style="text-align: center; margin-top: 30px;">
      <a href="https://minervaalcarazjoyeria.mx/the-circle" class="btn">Explorar Mi Experiencia CIRCLE</a>
    </div>

    ${BRAND_SIGNATURE}
  `;

  return wrapBaseEmailTemplate({
    title: "👑 Bienvenido a THE CIRCLE · Cofradía de Élite 💎",
    preheader: "Tu membresía exclusiva en Minerva Alcaraz ha sido activada.",
    contentHtml,
  });
}

/**
 * 5. New Collection Preview for THE CIRCLE with Embedded Product Cards & Photography
 */
export function getCircleNewCollectionTemplate({
  name,
  collectionName,
  previewUrl,
  products,
}: {
  name: string;
  collectionName: string;
  previewUrl?: string;
  products?: { name: string; details: string; price: string; imageUrl: string; badge: string }[];
}) {
  const defaultProducts = [
    {
      name: "Medallón Chai Ancestral",
      details: "Plata .925 esculpida a mano con cuarzo místico y grabado artesanal.",
      price: "$5,200 MXN",
      imageUrl: "https://res.cloudinary.com/dlsc3ova5/image/upload/f_auto,q_auto,w_400/v1778275655/minerva_joyeria/products/chai/CHAI.jpg",
      badge: "Edición Limitada 1 de 5",
    },
    {
      name: "Anillo Ébano Imperial",
      details: "Montura en Plata con Amatista natural pulida a mano.",
      price: "$4,800 MXN",
      imageUrl: "https://res.cloudinary.com/dlsc3ova5/image/upload/f_auto,q_auto,w_400/v1778275655/minerva_joyeria/products/ebano/EBANO.jpg",
      badge: "Pieza Única 1 de 1",
    },
  ];

  const showcaseProducts = products || defaultProducts;

  const productCardsHtml = showcaseProducts
    .map(
      (p) => `
      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: rgba(31, 39, 29, 0.7); border: 1px solid rgba(203, 182, 123, 0.35); margin-bottom: 20px;">
        <tr>
          <td width="40%" style="padding: 14px; vertical-align: middle;">
            <img src="${p.imageUrl}" alt="${p.name}" width="100%" style="display: block; border: 1px solid rgba(203, 182, 123, 0.3); max-width: 180px; height: auto;" />
          </td>
          <td width="60%" style="padding: 18px 18px 18px 5px; vertical-align: middle;">
            <span style="font-size: 8px; letter-spacing: 0.25em; color: #CBB67B; text-transform: uppercase; border: 1px solid #CBB67B; padding: 2px 6px; display: inline-block; margin-bottom: 6px;">${p.badge}</span>
            <h3 style="font-size: 17px; color: #E5DBD6; font-family: 'Cormorant Garamond', Georgia, serif; margin: 6px 0 4px 0; font-weight: 400;">${p.name}</h3>
            <p style="font-size: 11px; color: rgba(229, 219, 214, 0.75); margin: 0 0 10px 0; line-height: 1.5; font-weight: 300;">${p.details}</p>
            <span style="font-size: 12px; color: #CBB67B; font-weight: 600; font-family: monospace;">${p.price}</span>
          </td>
        </tr>
      </table>
    `
    )
    .join("");

  const contentHtml = `
    <div style="text-align: center; margin-bottom: 25px;">
      <span style="font-size: 9px; letter-spacing: 0.5em; color: #CBB67B; text-transform: uppercase;">Lanzamiento Exclusivo CIRCLE</span>
      <h2 style="font-size: 26px; color: #E5DBD6; font-style: italic; font-weight: 300; margin: 10px 0; font-family: 'Cormorant Garamond', Georgia, serif;">Novedad: ${collectionName}</h2>
    </div>

    <p style="font-size: 14px; line-height: 1.8; color: #E5DBD6;">
      Estimado(a) <strong>${name}</strong>,
    </p>

    <p style="font-size: 13px; line-height: 1.8; color: rgba(229, 219, 214, 0.9); font-weight: 300; font-style: italic; font-family: 'Cormorant Garamond', Georgia, serif; border-left: 2px solid #CBB67B; padding-left: 15px; margin: 20px 0;">
      ${BRAND_ESSENCE_QUOTE}
    </p>

    <p style="font-size: 12px; line-height: 1.8; color: rgba(229, 219, 214, 0.85); font-weight: 300;">
      Como distinguido miembro de THE CIRCLE, tienes acceso anticipado de 48 horas antes que la colección sea revelada al público. Te presentamos el catálogo fotográfico de las últimas piezas forjadas en nuestro Atelier de San Miguel de Allende.
    </p>

    <!-- PRODUCT PHOTOGRAPHY CARDS -->
    <div style="margin: 30px 0 20px 0;">
      <div style="font-size: 9px; letter-spacing: 0.35em; color: #CBB67B; text-transform: uppercase; margin-bottom: 16px; text-align: center;">Piezas Destacadas de la Colección</div>
      ${productCardsHtml}
    </div>

    <div style="text-align: center; margin-top: 25px;">
      <a href="${previewUrl || "https://minervaalcarazjoyeria.mx/colecciones"}" class="btn">Adquirir en Preestreno Privado</a>
    </div>

    ${BRAND_SIGNATURE}
  `;

  return wrapBaseEmailTemplate({
    title: `✨ Preestreno Exclusivo: ${collectionName} · THE CIRCLE 👑`,
    preheader: `Acceso anticipado de 48 horas para la colección ${collectionName}.`,
    contentHtml,
  });
}

/**
 * 6. Purchase Confirmation
 */
export function getPurchaseConfirmationTemplate({
  customerName,
  orderId,
  items,
  totalAmount,
}: {
  customerName: string;
  orderId: string;
  items: { name: string; price: number; quantity: number; image?: string }[];
  totalAmount: number;
}) {
  const itemsListHtml = items
    .map(
      (item) => `
      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: rgba(31, 39, 29, 0.7); border: 1px solid rgba(203, 182, 123, 0.35); margin-bottom: 12px;">
        <tr>
          <td width="25%" style="padding: 12px; vertical-align: middle;">
            ${item.image ? `<img src="${item.image}" alt="${item.name}" width="100%" style="display: block; border: 1px solid rgba(203, 182, 123, 0.3); max-width: 80px; height: auto;" />` : ''}
          </td>
          <td width="75%" style="padding: 12px; vertical-align: middle;">
            <h3 style="font-size: 14px; color: #E5DBD6; font-family: 'Cormorant Garamond', Georgia, serif; margin: 0 0 6px 0; font-weight: 400;">${item.name} (x${item.quantity})</h3>
            <span style="font-size: 12px; color: #CBB67B; font-weight: 600; font-family: monospace;">$${(item.price * item.quantity).toLocaleString("es-MX")} MXN</span>
          </td>
        </tr>
      </table>
    `
    )
    .join("");

  const contentHtml = `
    <div style="text-align: center; margin-bottom: 25px;">
      <span style="font-size: 9px; letter-spacing: 0.4em; color: #CBB67B; text-transform: uppercase;">Orden Confirmada</span>
      <h2 style="font-size: 26px; color: #E5DBD6; font-style: italic; font-weight: 300; margin: 10px 0; font-family: 'Cormorant Garamond', Georgia, serif;">Gracias por tu Adquisición</h2>
      <div style="font-family: monospace; font-size: 11px; color: #CBB67B; letter-spacing: 0.2em;">Orden: ${orderId}</div>
    </div>

    <p style="font-size: 14px; line-height: 1.8; color: #E5DBD6;">
      Hola <strong>${customerName}</strong>,
    </p>

    <p style="font-size: 13px; line-height: 1.8; color: rgba(229, 219, 214, 0.9); font-weight: 300; font-style: italic; font-family: 'Cormorant Garamond', Georgia, serif; border-left: 2px solid #CBB67B; padding-left: 15px; margin: 20px 0;">
      ${BRAND_ESSENCE_QUOTE}
    </p>

    <p style="font-size: 12px; line-height: 1.8; color: rgba(229, 219, 214, 0.85); font-weight: 300;">
      Hemos registrado tu pago exitosamente. Tus piezas han entrado al proceso de empaque en nuestro Atelier en San Miguel de Allende con todos los sellos de autenticidad.
    </p>
    
    <p style="font-size: 12px; line-height: 1.8; color: rgba(229, 219, 214, 0.85); font-weight: 300;">
      Un <strong>Concierge Privado</strong> ha sido asignado a tu orden. Se pondrá en contacto contigo a la brevedad para brindarte atención personalizada y confirmar los detalles de entrega.
    </p>

    <div style="background-color: rgba(31, 39, 29, 0.5); border: 1px solid rgba(203, 182, 123, 0.2); padding: 20px; margin: 25px 0;">
      <div style="font-size: 9px; letter-spacing: 0.3em; color: #CBB67B; text-transform: uppercase; margin-bottom: 15px;">Resumen de Joyas:</div>
      ${itemsListHtml}
      <div style="display: flex; justify-content: space-between; margin-top: 15px; pt: 10px; font-weight: bold; font-size: 14px; color: #CBB67B; border-top: 1px solid rgba(203, 182, 123, 0.2); padding-top: 15px;">
        <span>Total:</span>
        <span style="font-family: monospace;">$${totalAmount.toLocaleString("es-MX")} MXN</span>
      </div>
    </div>
    
    <div style="margin-top: 25px; padding: 15px; border: 1px dashed rgba(203, 182, 123, 0.3); text-align: center;">
      <h4 style="font-size: 11px; color: #CBB67B; text-transform: uppercase; letter-spacing: 0.2em; margin: 0 0 10px 0;">Política de Devoluciones</h4>
      <p style="font-size: 10px; line-height: 1.6; color: rgba(229, 219, 214, 0.7); margin: 0;">
        Garantizamos la excelencia de nuestras piezas. Si por alguna razón tu joya no cumple con tus expectativas, cuentas con <strong>30 días naturales</strong> desde la recepción para solicitar una devolución o cambio, siempre y cuando la pieza se encuentre en su estado original, sin uso y con sus certificados de autenticidad intactos. Tu concierge te asistirá en este proceso.
      </p>
    </div>

    <div style="text-align: center; margin-top: 30px;">
      <a href="https://minervaalcarazjoyeria.mx/perfil/pedidos" class="btn">Rastrear Mi Pedido</a>
    </div>

    ${BRAND_SIGNATURE}
  `;

  return wrapBaseEmailTemplate({
    title: `💎 Confirmación de Compra · Orden ${orderId} ✨`,
    preheader: `Hemos recibido tu pedido ${orderId} en Minerva Alcaraz. Un concierge te atenderá pronto.`,
    contentHtml,
  });
}

export function getAdminPurchaseNotificationTemplate({
  orderId,
  customerName,
  customerEmail,
  totalAmount,
  items,
}: {
  orderId: string;
  customerName: string;
  customerEmail: string;
  totalAmount: number;
  items: { name: string; quantity: number }[];
}) {
  const itemsListHtml = items
    .map(
      (item) => `
      <div style="margin-bottom: 5px; font-size: 12px; color: #E5DBD6;">
        • ${item.name} (x${item.quantity})
      </div>
    `
    )
    .join("");

  const contentHtml = `
    <div style="text-align: left; margin-bottom: 25px;">
      <span style="font-size: 9px; letter-spacing: 0.4em; color: #CBB67B; text-transform: uppercase;">Notificación de Administrador</span>
      <h2 style="font-size: 20px; color: #E5DBD6; font-weight: 400; margin: 10px 0;">Nueva Orden Ingresada</h2>
    </div>

    <p style="font-size: 13px; line-height: 1.8; color: #E5DBD6;">
      Se ha procesado un nuevo pedido en el sistema. Es necesario asignar un concierge e iniciar el proceso de empaque.
    </p>

    <div style="background-color: rgba(31, 39, 29, 0.5); border: 1px solid rgba(203, 182, 123, 0.2); padding: 20px; margin: 20px 0;">
      <ul style="list-style: none; padding: 0; margin: 0; font-size: 12px; color: #E5DBD6; line-height: 2;">
        <li><strong style="color: #CBB67B;">Orden ID:</strong> ${orderId}</li>
        <li><strong style="color: #CBB67B;">Cliente:</strong> ${customerName}</li>
        <li><strong style="color: #CBB67B;">Email:</strong> ${customerEmail}</li>
        <li><strong style="color: #CBB67B;">Total:</strong> $${totalAmount.toLocaleString("es-MX")} MXN</li>
      </ul>
      
      <div style="margin-top: 15px; border-top: 1px solid rgba(203, 182, 123, 0.2); padding-top: 15px;">
        <strong style="color: #CBB67B; font-size: 12px; display: block; margin-bottom: 10px;">Artículos:</strong>
        ${itemsListHtml}
      </div>
    </div>
    
    <div style="text-align: center; margin-top: 30px;">
      <a href="https://minervaalcarazjoyeria.mx/admin/orders/${orderId}" class="btn">Ver Detalles de la Orden</a>
    </div>
  `;

  return wrapBaseEmailTemplate({
    title: `💰 Nueva Compra Recibida - Orden ${orderId}`,
    preheader: `El cliente ${customerName} ha realizado una nueva compra.`,
    contentHtml,
  });
}

export function getOrderDeliveredTemplate({
  customerName,
  orderId,
}: {
  customerName: string;
  orderId: string;
}) {
  const contentHtml = `
    <div style="text-align: center; margin-bottom: 25px;">
      <span style="font-size: 9px; letter-spacing: 0.4em; color: #CBB67B; text-transform: uppercase;">Legado Entregado</span>
      <h2 style="font-size: 26px; color: #E5DBD6; font-style: italic; font-weight: 300; margin: 10px 0; font-family: 'Cormorant Garamond', Georgia, serif;">Tu Pieza ha Llegado</h2>
      <div style="font-family: monospace; font-size: 11px; color: #CBB67B; letter-spacing: 0.2em;">Orden: ${orderId}</div>
    </div>

    <p style="font-size: 14px; line-height: 1.8; color: #E5DBD6;">
      Hola <strong>${customerName}</strong>,
    </p>

    <p style="font-size: 13px; line-height: 1.8; color: rgba(229, 219, 214, 0.9); font-weight: 300; font-style: italic; font-family: 'Cormorant Garamond', Georgia, serif; border-left: 2px solid #CBB67B; padding-left: 15px; margin: 20px 0;">
      "Cada joya cuenta una historia. Ahora es momento de que comiences a escribir la tuya con esta pieza."
    </p>

    <p style="font-size: 12px; line-height: 1.8; color: rgba(229, 219, 214, 0.85); font-weight: 300;">
      Nos complace informarte que tu pedido <strong>${orderId}</strong> ha sido entregado exitosamente. Esperamos que esta joya cumpla con todas tus expectativas y se convierta en un tesoro invaluable para ti.
    </p>
    
    <p style="font-size: 12px; line-height: 1.8; color: rgba(229, 219, 214, 0.85); font-weight: 300;">
      Tu concierge sigue a tu disposición para cualquier duda sobre el cuidado de tu pieza, mantenimientos futuros o políticas de garantía.
    </p>

    <div style="text-align: center; margin-top: 30px;">
      <a href="https://minervaalcarazjoyeria.mx/perfil/cuidado-ritual" class="btn">Conocer el Ritual de Cuidado</a>
    </div>

    ${BRAND_SIGNATURE}
  `;

  return wrapBaseEmailTemplate({
    title: `📦 Tu Pedido de Minerva Alcaraz ha sido entregado ✨`,
    preheader: `Tu orden ${orderId} ha llegado a su destino.`,
    contentHtml,
  });
}

/**
 * 7. Purchase Thank You & Care Ritual Guide
 */
export function getPurchaseThankYouTemplate({ customerName }: { customerName: string }) {
  const contentHtml = `
    <div style="text-align: center; margin-bottom: 25px;">
      <span style="font-size: 9px; letter-spacing: 0.4em; color: #CBB67B; text-transform: uppercase;">Gratitud &amp; Herencia</span>
      <h2 style="font-size: 26px; color: #E5DBD6; font-style: italic; font-weight: 300; margin: 10px 0; font-family: 'Cormorant Garamond', Georgia, serif;">El Ritual de Cuidado</h2>
    </div>

    <p style="font-size: 14px; line-height: 1.8; color: #E5DBD6;">
      Estimado(a) <strong>${customerName}</strong>,
    </p>

    <p style="font-size: 14px; line-height: 1.8; color: rgba(229, 219, 214, 0.9); font-weight: 300; font-style: italic; font-family: 'Cormorant Garamond', Georgia, serif; border-left: 2px solid #CBB67B; padding-left: 15px; margin: 20px 0;">
      ${BRAND_ESSENCE_QUOTE}
    </p>

    <p style="font-size: 12px; line-height: 1.8; color: rgba(229, 219, 214, 0.85); font-weight: 300;">
      Una joya de autor cobra verdadera vida cuando encuentra a su portador. Deseamos que esta pieza sea un legado que te acompañe en tus momentos más entrañables.
    </p>

    <div style="background-color: rgba(31, 39, 29, 0.5); border: 1px solid rgba(203, 182, 123, 0.2); padding: 20px; margin: 25px 0;">
      <div style="font-size: 9px; letter-spacing: 0.3em; color: #CBB67B; text-transform: uppercase; margin-bottom: 10px;">Consejos para el Cuidado de tu Joya:</div>
      <ul style="margin: 0; padding-left: 20px; font-size: 11px; color: #E5DBD6; line-height: 1.8;">
        <li>Guarda tu pieza en su estuche original de seda hueso para evitar fricción.</li>
        <li>Evita el contacto con perfumes o químicos abrasivos.</li>
        <li>Limpia suavemente con el paño de gamuza incluido en tu caja.</li>
      </ul>
    </div>

    <div style="text-align: center; margin-top: 30px;">
      <a href="https://minervaalcarazjoyeria.mx/perfil/cuidado-ritual" class="btn">Ver Guía Completa de Cuidado</a>
    </div>

    ${BRAND_SIGNATURE}
  `;

  return wrapBaseEmailTemplate({
    title: "🌹 Gracias por tu Compra · Guía del Ritual de Cuidado ✨",
    preheader: "Recomendaciones esenciales para preservar la belleza de tu joya.",
    contentHtml,
  });
}

/**
 * 8. Password Reset Request
 */
export function getPasswordResetTemplate({ name, resetUrl }: { name: string; resetUrl: string }) {
  const contentHtml = `
    <div style="text-align: center; margin-bottom: 25px;">
      <span style="font-size: 9px; letter-spacing: 0.4em; color: #CBB67B; text-transform: uppercase;">Seguridad de Cuenta</span>
      <h2 style="font-size: 26px; color: #E5DBD6; font-style: italic; font-weight: 300; margin: 10px 0; font-family: 'Cormorant Garamond', Georgia, serif;">Restablecer Contraseña</h2>
    </div>

    <p style="font-size: 14px; line-height: 1.8; color: #E5DBD6;">
      Hola <strong>${name}</strong>,
    </p>

    <p style="font-size: 13px; line-height: 1.8; color: rgba(229, 219, 214, 0.9); font-weight: 300; font-style: italic; font-family: 'Cormorant Garamond', Georgia, serif; border-left: 2px solid #CBB67B; padding-left: 15px; margin: 20px 0;">
      ${BRAND_ESSENCE_QUOTE}
    </p>

    <p style="font-size: 12px; line-height: 1.8; color: rgba(229, 219, 214, 0.85); font-weight: 300;">
      Hemos recibido una solicitud para restablecer la clave de acceso a tu cuenta en Minerva Alcaraz. Haz clic en el siguiente enlace para definir tu nueva contraseña.
    </p>

    <div style="text-align: center; margin-top: 30px;">
      <a href="${resetUrl}" class="btn">Restablecer Mi Contraseña</a>
    </div>

    <p style="font-size: 10px; color: #8E9A8B; text-align: center; margin-top: 25px;">
      Si no solicitaste este cambio, puedes ignorar este mensaje de forma segura.
    </p>

    ${BRAND_SIGNATURE}
  `;

  return wrapBaseEmailTemplate({
    title: "🔑 Restablecer Contraseña · Minerva Alcaraz 🛡️",
    preheader: "Solicitud de restablecimiento de contraseña para tu cuenta.",
    contentHtml,
  });
}

/**
 * 9. Abandoned Cart Reminder (Bolsa Personalizada)
 */
export function getAbandonedCartTemplate({
  customerName,
  items,
  cartUrl,
}: {
  customerName: string;
  items?: { name: string; price: number; image: string; collection?: string }[];
  cartUrl?: string;
}) {
  const defaultItems = [
    {
      name: "Medallón Chai Ancestral",
      price: 5200,
      image: "https://res.cloudinary.com/dlsc3ova5/image/upload/f_auto,q_auto,w_400/v1778275655/minerva_joyeria/products/chai/CHAI.jpg",
      collection: "Colección Chai",
    },
    {
      name: "Anillo Ébano Imperial",
      price: 4800,
      image: "https://res.cloudinary.com/dlsc3ova5/image/upload/f_auto,q_auto,w_400/v1778275655/minerva_joyeria/products/ebano/EBANO.jpg",
      collection: "Colección Amatista",
    },
  ];

  const cartItems = items || defaultItems;

  const itemsHtml = cartItems
    .map(
      (item) => `
      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: rgba(31, 39, 29, 0.7); border: 1px solid rgba(203, 182, 123, 0.35); margin-bottom: 16px;">
        <tr>
          <td width="35%" style="padding: 12px; vertical-align: middle;">
            <img src="${item.image}" alt="${item.name}" width="100%" style="display: block; border: 1px solid rgba(203, 182, 123, 0.3); max-width: 140px; height: auto;" />
          </td>
          <td width="65%" style="padding: 16px 16px 16px 5px; vertical-align: middle;">
            ${item.collection ? `<span style="font-size: 8px; letter-spacing: 0.25em; color: #CBB67B; text-transform: uppercase;">${item.collection}</span>` : ""}
            <h3 style="font-size: 16px; color: #E5DBD6; font-family: 'Cormorant Garamond', Georgia, serif; margin: 4px 0; font-weight: 400;">${item.name}</h3>
            <span style="font-size: 12px; color: #CBB67B; font-weight: 600; font-family: monospace;">$${item.price.toLocaleString("es-MX")} MXN</span>
          </td>
        </tr>
      </table>
    `
    )
    .join("");

  const contentHtml = `
    <div style="text-align: center; margin-bottom: 25px;">
      <span style="font-size: 9px; letter-spacing: 0.4em; color: #CBB67B; text-transform: uppercase;">Bolsa Reservada en Atelier</span>
      <h2 style="font-size: 26px; color: #E5DBD6; font-style: italic; font-weight: 300; margin: 10px 0; font-family: 'Cormorant Garamond', Georgia, serif;">Tus Piezas te Esperan</h2>
    </div>

    <p style="font-size: 14px; line-height: 1.8; color: #E5DBD6;">
      Hola <strong>${customerName}</strong>,
    </p>

    <p style="font-size: 13px; line-height: 1.8; color: rgba(229, 219, 214, 0.9); font-weight: 300; font-style: italic; font-family: 'Cormorant Garamond', Georgia, serif; border-left: 2px solid #CBB67B; padding-left: 15px; margin: 20px 0;">
      ${BRAND_ESSENCE_QUOTE}
    </p>

    <p style="font-size: 12px; line-height: 1.8; color: rgba(229, 219, 214, 0.85); font-weight: 300;">
      Notamos que dejaste piezas únicas guardadas en tu bolsa de compra. Nuestras creaciones son elaboradas en series muy limitadas en nuestro Atelier de San Miguel de Allende. Te invitamos a hacerlas tuyas antes de que sean reservadas por alguien más.
    </p>

    <div style="margin: 25px 0;">
      <div style="font-size: 9px; letter-spacing: 0.35em; color: #CBB67B; text-transform: uppercase; margin-bottom: 14px; text-align: center;">Piezas en tu Bolsa</div>
      ${itemsHtml}
    </div>

    <div style="text-align: center; margin-top: 30px;">
      <a href="${cartUrl || "https://minervaalcarazjoyeria.mx/cart"}" class="btn">Completar Mi Adquisición</a>
    </div>

    ${BRAND_SIGNATURE}
  `;

  return wrapBaseEmailTemplate({
    title: "🛒 Tus Piezas en el Atelier te Esperan · Minerva Alcaraz ✨",
    preheader: "Tus piezas seleccionadas siguen guardadas en tu bolsa de compra.",
    contentHtml,
  });
}

/**
 * 10. Saved Favorites Reminder (Joyas Predilectas)
 */
export function getSavedFavoritesTemplate({
  customerName,
  items,
  favoritesUrl,
}: {
  customerName: string;
  items?: { name: string; price: number; image: string; collection?: string }[];
  favoritesUrl?: string;
}) {
  const defaultItems = [
    {
      name: "Brazalete Ébano & Oro",
      price: 6800,
      image: "https://res.cloudinary.com/dlsc3ova5/image/upload/f_auto,q_auto,w_400/v1778275655/minerva_joyeria/products/hueso/HUESO.jpg",
      collection: "Colección Ébano",
    },
    {
      name: "Medallón Chai Ancestral",
      price: 5200,
      image: "https://res.cloudinary.com/dlsc3ova5/image/upload/f_auto,q_auto,w_400/v1778275655/minerva_joyeria/products/chai/CHAI.jpg",
      collection: "Colección Chai",
    },
  ];

  const favoriteItems = items || defaultItems;

  const itemsHtml = favoriteItems
    .map(
      (item) => `
      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: rgba(31, 39, 29, 0.7); border: 1px solid rgba(203, 182, 123, 0.35); margin-bottom: 16px;">
        <tr>
          <td width="35%" style="padding: 12px; vertical-align: middle;">
            <img src="${item.image}" alt="${item.name}" width="100%" style="display: block; border: 1px solid rgba(203, 182, 123, 0.3); max-width: 140px; height: auto;" />
          </td>
          <td width="65%" style="padding: 16px 16px 16px 5px; vertical-align: middle;">
            ${item.collection ? `<span style="font-size: 8px; letter-spacing: 0.25em; color: #CBB67B; text-transform: uppercase;">${item.collection}</span>` : ""}
            <h3 style="font-size: 16px; color: #E5DBD6; font-family: 'Cormorant Garamond', Georgia, serif; margin: 4px 0; font-weight: 400;">${item.name}</h3>
            <span style="font-size: 12px; color: #CBB67B; font-weight: 600; font-family: monospace;">$${item.price.toLocaleString("es-MX")} MXN</span>
          </td>
        </tr>
      </table>
    `
    )
    .join("");

  const contentHtml = `
    <div style="text-align: center; margin-bottom: 25px;">
      <span style="font-size: 9px; letter-spacing: 0.4em; color: #CBB67B; text-transform: uppercase;">Tus Joyas Predilectas</span>
      <h2 style="font-size: 26px; color: #E5DBD6; font-style: italic; font-weight: 300; margin: 10px 0; font-family: 'Cormorant Garamond', Georgia, serif;">Tus Piezas Favoritas</h2>
    </div>

    <p style="font-size: 14px; line-height: 1.8; color: #E5DBD6;">
      Hola <strong>${customerName}</strong>,
    </p>

    <p style="font-size: 13px; line-height: 1.8; color: rgba(229, 219, 214, 0.9); font-weight: 300; font-style: italic; font-family: 'Cormorant Garamond', Georgia, serif; border-left: 2px solid #CBB67B; padding-left: 15px; margin: 20px 0;">
      ${BRAND_ESSENCE_QUOTE}
    </p>

    <p style="font-size: 12px; line-height: 1.8; color: rgba(229, 219, 214, 0.85); font-weight: 300;">
      Recordamos que has guardado estas hermosas piezas en tu lista de favoritos. Cada una fue concebida en nuestro Atelier de San Miguel de Allende para transmitir historias inolvidables.
    </p>

    <div style="margin: 25px 0;">
      <div style="font-size: 9px; letter-spacing: 0.35em; color: #CBB67B; text-transform: uppercase; margin-bottom: 14px; text-align: center;">Tus Favoritos Guardados</div>
      ${itemsHtml}
    </div>

    <div style="text-align: center; margin-top: 30px;">
      <a href="${favoritesUrl || "https://minervaalcarazjoyeria.mx/favorites"}" class="btn">Ver Mis Favoritos</a>
    </div>

    ${BRAND_SIGNATURE}
  `;

  return wrapBaseEmailTemplate({
    title: "💖 Tus Piezas Favoritas Guardadas en el Atelier · Minerva Alcaraz ✨",
    preheader: "Descubre de nuevo las joyas que guardaste como tus favoritas.",
    contentHtml,
  });
}

