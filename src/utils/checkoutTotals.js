import { roundMoney } from "./money";

export function calculateShipping({
  subtotal,
  method,
  freeThreshold,
  deliveryMethods,
}) {
  const selected = deliveryMethods.find((m) => m.id === method);

  if (!selected) return 0;

  // Standard shipping is free over the threshold; otherwise the flat rate.
  if (selected.freeOverThreshold && subtotal >= freeThreshold) return 0;

  return selected.price || 0;
}

export function calculateDiscount({ subtotal, discountPercent = 0 }) {
  return roundMoney((subtotal * discountPercent) / 100);
}

export function calculateTotals({
  subtotal,
  shipping,
  discount,
  tax = 0,
}) {
  const total = roundMoney(Math.max(0, subtotal + shipping - discount + tax));
  return { subtotal, shipping, discount, tax, total };
}
