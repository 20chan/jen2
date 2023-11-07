'use client';

import { TransactionWithCategories } from '@/lib/db/transaction';
import { CategoryWrapped } from '@/lib/utils';
import { CategoryLabel } from '../CategoryLabel';

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
  async function handleAddCategory(category: CategoryWrapped) {
    const res = await fetch('/api/categorize', {
      method: 'POST',
      body: JSON.stringify({
        transactionId: transaction.id,
        categoryId: category.id,
      }),
    });
  }

  async function handleRemoveCategory(category: CategoryWrapped) {
    const res = await fetch('/api/categorize', {
      method: 'DELETE',
      body: JSON.stringify({
        transactionId: transaction.id,
        categoryId: category.id,
      }),
    });
  }

  return (
    <div style={{ visibility: enabled ? 'visible' : 'hidden', position: 'absolute', zIndex: '10', top, left }}>
      <div className='fixed inset-0 z-10' onClick={() => setEnabled(false)} />
      <div className='bg-half-dark-black/95 border border-half-dark-white relative z-20'>
        <div className='flex flex-col px-4 py-2'>
          {
            categories.map(category => (
              <div key={category.name} className='py-0.5 flex'>
                <div className='flex-1'>
                  <CategoryLabel category={category} />
                </div>

                <div className='ml-2'>
                  <button className='w-12 bg-half-dark-green/30' onClick={() => handleAddCategory(category)}>
                    +
                  </button>
                  <button className='w-12 bg-half-dark-red/30' onClick={() => handleRemoveCategory(category)}>
                    x
                  </button>
                </div>
              </div>
            ))
          }
        </div>
      </div>

    </div>
  )

}