// Format number as Indian Rupee: 1234.5 → ₹1,234.50
export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
  }).format(amount);
}

// Format date: 2024-01-15T10:30:00 → "15 Jan, 10:30 AM"
export function formatDate(isoString) {
  const date = new Date(isoString);
  return date.toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

// Generate a fake but realistic-looking transaction ID
export function generateTxnId() {
  const prefix = 'TXN';
  const timestamp = Date.now().toString().slice(-8);
  const random = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `${prefix}${timestamp}${random}`;
}