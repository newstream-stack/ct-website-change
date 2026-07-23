export function formatCheckoutAmountLabel(
  amount: number,
  paymentType: 'one-time' | 'installment',
  installmentPeriod: number,
): string {
  if (paymentType !== 'installment') return `(NT$ ${amount})`;
  const perPeriod = Math.ceil(amount / installmentPeriod);
  return `(約 NT$ ${perPeriod} / 期 × ${installmentPeriod} 期，總額 NT$ ${amount})`;
}
