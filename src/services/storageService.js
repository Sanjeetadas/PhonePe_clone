import AsyncStorage from '@react-native-async-storage/async-storage';

const TRANSACTIONS_KEY = '@phonepe_clone_transactions';

// Save a new transaction to local storage
export async function saveTransaction(transaction) {
  try {
    const existing = await getTransactions();
    const updated = [transaction, ...existing]; // newest first
    await AsyncStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(updated));
    return true;
  } catch (err) {
    console.error('saveTransaction error:', err);
    return false;
  }
}

// Get all transactions from local storage
export async function getTransactions() {
  try {
    const data = await AsyncStorage.getItem(TRANSACTIONS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (err) {
    console.error('getTransactions error:', err);
    return [];
  }
}

// Clear all transactions (for testing/reset)
export async function clearTransactions() {
  try {
    await AsyncStorage.removeItem(TRANSACTIONS_KEY);
    return true;
  } catch (err) {
    return false;
  }
}

// ── Wallet Balance ──────────────────────────────────

const BALANCE_KEY = '@phonepe_clone_balance';
const DEFAULT_BALANCE = 10000; // Starting balance ₹10,000

export async function getBalance() {
  try {
    const data = await AsyncStorage.getItem(BALANCE_KEY);
    return data ? parseFloat(data) : DEFAULT_BALANCE;
  } catch {
    return DEFAULT_BALANCE;
  }
}

export async function setBalance(amount) {
  try {
    await AsyncStorage.setItem(BALANCE_KEY, String(amount));
    return true;
  } catch {
    return false;
  }
}

export async function deductBalance(amount) {
  const current = await getBalance();
  if (current < amount) return { success: false, error: 'Insufficient balance' };
  await setBalance(current - amount);
  return { success: true, newBalance: current - amount };
}

export async function addMoney(amount) {
  const current = await getBalance();
  const newBal = current + parseFloat(amount);
  await setBalance(newBal);
  return newBal;
}