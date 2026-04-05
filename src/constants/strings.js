/**
 * STRINGS.js
 * ──────────
 * All hardcoded user-facing text lives here.
 * This makes it trivial to add multi-language support later.
 */

export const STRINGS = {
  app: {
    name: 'PhonePe',
  },
  home: {
    greeting:        'Good Morning',
    balance:         'Wallet Balance',
    scanAndPay:      'Scan & Pay',
    sendMoney:       'Send Money',
    recentTxns:      'Recent Transactions',
    noTxns:          'No transactions yet',
  },
  scanner: {
    title:           'Scan QR Code',
    instruction:     'Point camera at a UPI QR code',
    permissionTitle: 'Camera Permission Required',
    permissionMsg:   'Please allow camera access to scan QR codes',
    invalidQR:       'Invalid QR code. Please scan a valid UPI QR.',
    missingFields:   'QR code is missing UPI ID or name.',
  },
  payment: {
    title:           'Send Money',
    amountLabel:     'Enter Amount',
    amountPlaceholder: '0',
    payButton:       'Pay Now',
    processing:      'Processing...',
  },
  success: {
    title:           'Payment Successful!',
    txnId:           'Transaction ID',
    doneButton:      'Back to Home',
    viewHistory:     'View History',
  },
  history: {
    title:           'Transactions',
    empty:           'No transactions found',
  },
  errors: {
    invalidAmount:   'Please enter a valid amount',
    minAmount:       'Minimum amount is ₹1',
    maxAmount:       'Maximum amount is ₹1,00,000',
    generic:         'Something went wrong. Please try again.',
  },
};