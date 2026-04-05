// import { useState, useEffect, useCallback } from 'react';
// import { getTransactions } from '../services/storageService';

// export function useTransactions() {
//   const [transactions, setTransactions] = useState([]);
//   const [loading, setLoading]           = useState(true);

//   const load = useCallback(async () => {
//     setLoading(true);
//     const data = await getTransactions();
//     setTransactions(data);
//     setLoading(false);
//   }, []);

//   useEffect(() => { load(); }, [load]);

//   return { transactions, loading, reload: load };
// }

import { useState, useEffect, useCallback } from 'react';
import { getTransactions } from '../services/storageService';
import { getBalance, addMoney, setBalance } from '../services/storageService';

export function useTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [balance, setBalanceState]      = useState(10000);

  const load = useCallback(async () => {
    setLoading(true);
    const [data, bal] = await Promise.all([getTransactions(), getBalance()]);
    setTransactions(data);
    setBalanceState(bal);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  async function handleAddMoney(amount) {
    const newBal = await addMoney(amount);
    setBalanceState(newBal);
    return newBal;
  }

  return { transactions, loading, reload: load, balance, handleAddMoney };
}