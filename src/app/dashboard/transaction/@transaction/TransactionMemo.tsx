'use client';

import { useEffect, useState } from 'react';

interface TransactionMemoProps {
  memo: string;
  update: (memo: string) => void;
}

export function TransactionMemo({ memo: initialValue, update }: TransactionMemoProps) {
  const [memo, setMemo] = useState(initialValue);

  useEffect(() => {
    setMemo(initialValue)
  }, [initialValue]);

  return (
    <input type='text' value={memo} onChange={e => setMemo(e.target.value)} onBlur={e => {
      if (memo !== initialValue) {
        update(memo);
      }
    }}
      spellCheck={false}
      className='w-40 text-sm focus:outline-none bg-transparent text-half-white/80'
    />
  )
}