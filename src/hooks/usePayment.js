import { useState } from 'react';
import { processPayment } from '../services/paymentService';

export function usePayment() {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  async function pay(paymentDetails) {
    setLoading(true);
    setError(null);
    try {
      const result = await processPayment(paymentDetails);
      return result;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }

  return { pay, loading, error };
}