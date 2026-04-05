// import { generateTxnId } from '../utils/formatters';
// import { saveTransaction } from './storageService';

// /**
//  * Simulates a UPI payment.
//  * In a real app, this would call a payment gateway.
//  * Here we just wait 2 seconds and return success.
//  */
// export async function processPayment({ upiId, name, amount, note = '' }) {
//   // Simulate network delay (like a real payment)
//   await new Promise((resolve) => setTimeout(resolve, 2000));

//   // 95% success rate simulation (realistic behavior)
//   const isSuccess = Math.random() > 0.05;

//   if (!isSuccess) {
//     throw new Error('Payment failed. Please try again.');
//   }

//   const transaction = {
//     id: generateTxnId(),
//     upiId,
//     name,
//     amount: parseFloat(amount),
//     note,
//     status: 'SUCCESS',
//     timestamp: new Date().toISOString(),
//   };

//   // Save to local storage
//   await saveTransaction(transaction);

//   return transaction;
// }

// import { generateTxnId } from '../utils/formatters';
// import { saveTransaction, deductBalance } from './storageService';

// export async function processPayment({ upiId, name, amount, note = '' }) {
//   // Simulate network delay
//   await new Promise((resolve) => setTimeout(resolve, 2000));

//   // Check and deduct balance
//   const deduction = await deductBalance(parseFloat(amount));
//   if (!deduction.success) {
//     throw new Error('Insufficient wallet balance');
//   }

//   // 95% success simulation
//   const isSuccess = Math.random() > 0.05;
//   if (!isSuccess) {
//     // Refund if payment fails
//     const { addMoney } = require('./storageService');
//     await addMoney(parseFloat(amount));
//     throw new Error('Payment failed. Amount refunded.');
//   }

//   const transaction = {
//     id:        generateTxnId(),
//     upiId,
//     name,
//     amount:    parseFloat(amount),
//     note,
//     status:    'SUCCESS',
//     timestamp: new Date().toISOString(),
//   };

//   await saveTransaction(transaction);
//   return transaction;
// }

import { generateTxnId } from '../utils/formatters';
import { saveTransaction, deductBalance } from './storageService';

export async function processPayment({ upiId, name, amount, note = '' }) {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Check and deduct balance
  const deduction = await deductBalance(parseFloat(amount));
  if (!deduction.success) {
    throw new Error('Insufficient wallet balance');
  }

  // 95% success simulation
  const isSuccess = Math.random() > 0.05;
  if (!isSuccess) {
    // Refund if payment fails
    const { addMoney } = require('./storageService');
    await addMoney(parseFloat(amount));
    throw new Error('Payment failed. Amount refunded.');
  }

  const transaction = {
    id:        generateTxnId(),
    upiId,
    name,
    amount:    parseFloat(amount),
    note,
    status:    'SUCCESS',
    timestamp: new Date().toISOString(),
  };

  await saveTransaction(transaction);
  return transaction;
}