const MONEY_FORMATTER = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatMoney(value) {
  const number = Number(value);
  return MONEY_FORMATTER.format(Number.isFinite(number) ? number : 0);
}

export function roundMoney(value) {
  return Math.round((Number(value) || 0) * 100) / 100;
}
