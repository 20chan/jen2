'use client';

import { useEffect, useState } from 'react';

interface TransactionAmountProps {
  amount: number;
  update: (amount: number) => void;
}

export function TransactionAmount({ amount: initialValue, update }: TransactionAmountProps) {
  const [amount, setAmount] = useState(initialValue);

  useEffect(() => {
    setAmount(initialValue)
  }, [initialValue]);

  return (
    <input type='number' value={amount} onChange={e => setAmount(e.target.valueAsNumber)} onBlur={e => {
      if (amount !== initialValue) {
        update(amount);
      }
    }}
      spellCheck={false}
      className='w-16 inline-block text-right focus:outline-none bg-transparent'
    />
  )
}