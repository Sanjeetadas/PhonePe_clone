// Validates UPI ID format: something@bankname
export function isValidUPIId(upiId) {
  const upiRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+$/;
  return upiRegex.test(upiId);
}

// Validates payment amount
export function isValidAmount(amount) {
  const num = parseFloat(amount);
  if (isNaN(num)) return { valid: false, error: 'Enter a valid amount' };
  if (num < 1)    return { valid: false, error: 'Minimum amount is ₹1' };
  if (num > 100000) return { valid: false, error: 'Maximum is ₹1,00,000' };
  return { valid: true };
}