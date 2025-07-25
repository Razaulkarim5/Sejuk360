// utils/formatter.js

export function formatDate(timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleString('en-MY', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-MY', {
    style: 'currency',
    currency: 'MYR',
  }).format(amount);
}
