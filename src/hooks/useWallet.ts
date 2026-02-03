import { useState, useCallback, useEffect, useRef } from 'react';

const INITIAL_BALANCE = 500; // Starting balance in rupees
const STORAGE_KEY = 'astroconnect_wallet_balance';

export const useWallet = () => {
  const [balance, setBalance] = useState<number>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? parseFloat(stored) : INITIAL_BALANCE;
  });
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, balance.toString());
  }, [balance]);

  const deductBalance = useCallback((amount: number) => {
    setBalance((prev) => {
      const newBalance = Math.max(0, prev - amount);
      return parseFloat(newBalance.toFixed(2));
    });
  }, []);

  const startDeduction = useCallback((pricePerMinute: number, onBalanceZero: () => void) => {
    // Stop any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Deduct every 6 seconds (1/10th of a minute for demo purposes)
    const deductionInterval = 6000; // 6 seconds
    const amountPerInterval = pricePerMinute / 10;

    intervalRef.current = setInterval(() => {
      setBalance((prev) => {
        const newBalance = Math.max(0, prev - amountPerInterval);
        if (newBalance <= 0) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          onBalanceZero();
          return 0;
        }
        return parseFloat(newBalance.toFixed(2));
      });
    }, deductionInterval);
  }, []);

  const stopDeduction = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const resetBalance = useCallback(() => {
    setBalance(INITIAL_BALANCE);
  }, []);

  const addBalance = useCallback((amount: number) => {
    setBalance((prev) => parseFloat((prev + amount).toFixed(2)));
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    balance,
    deductBalance,
    startDeduction,
    stopDeduction,
    resetBalance,
    addBalance,
    isLow: balance < 50,
    isEmpty: balance <= 0,
  };
};
