/**
 * Promoción Buen Fin — Minerva Alcaraz Joyería
 * Vigencia: Del 15 de noviembre de 2026 al 17 de noviembre de 2026 a las 23:00 (11:00 PM) hora de México (CST, UTC-6).
 *
 * Reglas:
 * - 15% de descuento en toda la tienda sobre el total (productos + envío).
 * - Aplica también para miembros de THE CIRCLE sobre su beneficio existente.
 * - Acumulable con el 10% de Primera Compra: primero se aplica el 10% y luego +15% sobre el total con envío.
 */

export const BUEN_FIN_START_MS = Date.parse("2026-11-15T00:00:00-06:00");
export const BUEN_FIN_END_MS = Date.parse("2026-11-17T23:00:00-06:00");
export const BUEN_FIN_DISCOUNT_RATE = 0.15;
export const FIRST_PURCHASE_DISCOUNT_RATE = 0.10;

export function isBuenFinActive(now: Date = new Date()): boolean {
  const ts = now.getTime();
  return ts >= BUEN_FIN_START_MS && ts <= BUEN_FIN_END_MS;
}

export interface BuenFinCountdown {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}

export function getBuenFinTimeRemaining(now: Date = new Date()): BuenFinCountdown {
  const diff = BUEN_FIN_END_MS - now.getTime();
  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
  }
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  return { days, hours, minutes, seconds, isExpired: false };
}

export function applyBuenFinPrice(priceMxn: number): number {
  return Math.round(priceMxn * (1 - BUEN_FIN_DISCOUNT_RATE));
}

export interface OrderTotalsInputMxn {
  subtotalMxn: number;
  shippingCostMxn: number;
  isFirstPurchase: boolean;
  buenFinActive?: boolean;
}

export interface OrderTotalsResultMxn {
  subtotalMxn: number;
  firstPurchaseDiscountMxn: number;
  shippingCostMxn: number;
  totalBeforeBuenFinMxn: number;
  buenFinDiscountMxn: number;
  totalDiscountMxn: number;
  finalTotalMxn: number;
  ivaMxn: number;
  subtotalSinIvaMxn: number;
}

/**
 * Calcula los totales en MXN garantizando el orden:
 * 1. Primera compra: 10% sobre el subtotal de productos (si aplica).
 * 2. Suma de envío (con reglas de THE CIRCLE o estándar).
 * 3. Buen Fin: 15% sobre el total resultante (productos tras 10% + envío).
 */
export function calculateOrderTotalsMxn({
  subtotalMxn,
  shippingCostMxn,
  isFirstPurchase,
  buenFinActive = isBuenFinActive(),
}: OrderTotalsInputMxn): OrderTotalsResultMxn {
  const firstPurchaseDiscountMxn = isFirstPurchase
    ? Math.round(subtotalMxn * FIRST_PURCHASE_DISCOUNT_RATE * 100) / 100
    : 0;

  const totalBeforeBuenFinMxn =
    Math.round((subtotalMxn - firstPurchaseDiscountMxn + shippingCostMxn) * 100) / 100;

  const buenFinDiscountMxn = buenFinActive
    ? Math.round(totalBeforeBuenFinMxn * BUEN_FIN_DISCOUNT_RATE * 100) / 100
    : 0;

  const totalDiscountMxn =
    Math.round((firstPurchaseDiscountMxn + buenFinDiscountMxn) * 100) / 100;

  const finalTotalMxn =
    Math.round((totalBeforeBuenFinMxn - buenFinDiscountMxn) * 100) / 100;

  const ivaMxn = Math.round((finalTotalMxn - finalTotalMxn / 1.16) * 100) / 100;
  const subtotalSinIvaMxn = Math.round((finalTotalMxn - ivaMxn) * 100) / 100;

  return {
    subtotalMxn,
    firstPurchaseDiscountMxn,
    shippingCostMxn,
    totalBeforeBuenFinMxn,
    buenFinDiscountMxn,
    totalDiscountMxn,
    finalTotalMxn,
    ivaMxn,
    subtotalSinIvaMxn,
  };
}

export interface OrderTotalsInputCents {
  subtotalCents: number;
  shippingCents: number;
  isFirstPurchase: boolean;
  buenFinActive?: boolean;
}

export interface OrderTotalsResultCents {
  subtotalCents: number;
  firstPurchaseDiscountCents: number;
  shippingCents: number;
  totalBeforeBuenFinCents: number;
  buenFinDiscountCents: number;
  totalDiscountCents: number;
  totalCents: number;
  taxCents: number;
}

export function calculateOrderTotalsCents({
  subtotalCents,
  shippingCents,
  isFirstPurchase,
  buenFinActive = isBuenFinActive(),
}: OrderTotalsInputCents): OrderTotalsResultCents {
  const firstPurchaseDiscountCents = isFirstPurchase
    ? Math.round(subtotalCents * FIRST_PURCHASE_DISCOUNT_RATE)
    : 0;

  const totalBeforeBuenFinCents =
    subtotalCents - firstPurchaseDiscountCents + shippingCents;

  const buenFinDiscountCents = buenFinActive
    ? Math.round(totalBeforeBuenFinCents * BUEN_FIN_DISCOUNT_RATE)
    : 0;

  const totalDiscountCents = firstPurchaseDiscountCents + buenFinDiscountCents;
  const totalCents = totalBeforeBuenFinCents - buenFinDiscountCents;
  const taxCents = Math.round(totalCents - totalCents / 1.16);

  return {
    subtotalCents,
    firstPurchaseDiscountCents,
    shippingCents,
    totalBeforeBuenFinCents,
    buenFinDiscountCents,
    totalDiscountCents,
    totalCents,
    taxCents,
  };
}

