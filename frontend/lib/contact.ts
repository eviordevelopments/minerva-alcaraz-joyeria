/**
 * Minerva Alcaraz Joyería — Configuración Canales Oficiales de Contacto y Puntos de Venta
 */

export const CONTACT_PHONE_RAW = "4626217960";
export const CONTACT_PHONE_INTL = "524626217960";
export const CONTACT_PHONE_DISPLAY = "+52 462 621 7960";
export const CONTACT_PHONE_TEL = `tel:+${CONTACT_PHONE_INTL}`;

export const WHATSAPP_PHONE = CONTACT_PHONE_INTL;
export const WHATSAPP_DEFAULT_MESSAGE = "Hola Minerva Alcaraz Joyería, deseo asesoría personalizada sobre las piezas de alta joyería.";
export const WHATSAPP_LINK = `https://wa.me/${CONTACT_PHONE_INTL}?text=${encodeURIComponent(WHATSAPP_DEFAULT_MESSAGE)}`;

export const CONTACT_EMAIL = "minerva.alcaraz.joyeria@gmail.com";
export const CONTACT_EMAIL_MAILTO = `mailto:${CONTACT_EMAIL}`;

// Ubicaciones — Puntos de Venta Oficiales (No Atelier)
export const SAN_MIGUEL_NAME = "San Miguel de Allende";
export const SAN_MIGUEL_ADDRESS = "Mesones Número 74, Colonia Centro (dentro de Fina Catrina)";
export const SAN_MIGUEL_CITY = "San Miguel de Allende, Gto.";
export const SAN_MIGUEL_FULL_ADDRESS = "Mesones Número 74, Colonia Centro, dentro de Fina Catrina, San Miguel de Allende, Gto.";
export const SAN_MIGUEL_NOTE = "Para ir ahí será a través de citas por mensaje según disponibilidad. Favor de contactar a tu concierge por WhatsApp para reservar cita en la agenda.";
export const SAN_MIGUEL_CITA_MESSAGE = "Hola Minerva Alcaraz Joyería, deseo solicitar una cita para visitar el punto de venta en San Miguel de Allende (Mesones 74, dentro de Fina Catrina) según disponibilidad.";
export const SAN_MIGUEL_WHATSAPP_LINK = `https://wa.me/${CONTACT_PHONE_INTL}?text=${encodeURIComponent(SAN_MIGUEL_CITA_MESSAGE)}`;
export const SAN_MIGUEL_MAPS_URL = "https://www.google.com/maps/search/?api=1&query=Mesones+74,+Zona+Centro,+San+Miguel+de+Allende,+Gto.";

export const FLOROTECA_NAME = "Floroteca";
export const FLOROTECA_ADDRESS = "Av. Mariano J. García 1568, San Miguelito, 36643 Irapuato, Gto.";
export const FLOROTECA_CITY = "Irapuato, Gto.";
export const FLOROTECA_NOTE = "Punto de venta autorizado para explorar y adquirir colecciones selectas de Minerva Alcaraz.";
export const FLOROTECA_MAPS_URL = "https://maps.app.goo.gl/7GkvJAh7hBJSp3ez5?g_st=aw";
