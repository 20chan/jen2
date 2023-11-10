'use client';

import { TransactionWithCategories } from '@/lib/db/transaction';
import { CategoryWrapped } from '@/lib/utils';
import { CategoryLabel } from '../CategoryLabel';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export function EditCategoryMenu({
  transaction,
  categories,
  enabled,
  setEnabled,
  top,
  left,
}: {
  transaction: TransactionWithCategories;
  categories: CategoryWrapped[];
  enabled: boolean;
  setEnabled: (enabled: boolean) => void;
  top: number;
  left: number;
}) {
  const router = useRouter();

  const [activeIds, setActiveIds] = useState<number[]>(transaction.categories.map(x => x.categoryId));

  useEffect(() => {
    setActiveIds(transaction.categories.map(x => x.categoryId));
  }, [transaction.id, enabled]);

  async function submitChanges() {
    const exists = transaction.categories.map(x => x.categoryId);
    const categoryIdsAdded = activeIds.filter(x => !exists.includes(x));
    const categoryIdsRemoved = exists.filter(x => !activeIds.includes(x));

    const res = await fetch('/api/categorize/batch', {
      method: 'POST',
      body: JSON.stringify({
        transactionId: transaction.id,
        categoryIdsAdded,
        categoryIdsRemoved,
      }),
    });

    setEnabled(false);
    router.refresh();
  }

  return (
    <div style={{ visibility: enabled ? 'visible' : 'hidden', position: 'absolute', zIndex: '10', top, left }}>
      <div className='fixed inset-0 z-10' onClick={() => setEnabled(false)} />
      <div className='max-w-lg bg-half-dark-black/95 border border-half-dark-white relative z-20'>
        <div className='px-4 py-4'>
          <div className='flex flex-row flex-wrap gap-1 pb-2 mb-2 border-b border-b-half-dark-white/40'>
            {
              activeIds.map(id => {
                const category = categories.find(x => x.id === id)!;
                return (
                  <div key={id} onClick={() => setActiveIds(activeIds.filter(x => x !== id))} className='cursor-pointer'>
                    <CategoryLabel category={category} />
                  </div>
                )
              })
            }
          </div>
          <div className='flex flex-row flex-wrap gap-1 mb-1'>
            {
              categories.filter(x => !activeIds.includes(x.id)).map(category => {
                return (
                  <div key={category.id} onClick={() => setActiveIds([...activeIds, category.id])} className='cursor-pointer'>
                    <CategoryLabel category={category} />
                  </div>
                )
              })
            }
          </div>

          <div>
            <button onClick={submitChanges} className='px-2 py-1 bg-half-dark-green/50 hover:bg-half-dark-green/70 w-full'>
              Update
            </button>
          </div>
        </div>
      </div>

    </div>
  )

}