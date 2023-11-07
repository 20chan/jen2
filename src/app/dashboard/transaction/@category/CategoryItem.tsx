'use client';

import { CategoryWrapped } from '@/lib/utils';
import { TransactionListPageContext } from '../TransactionListPageContext';
import { CategoryLabel } from '../CategoryLabel';
import Link from 'next/link';
import { CategoryParams } from '@/lib/params';
import { useState } from 'react';

interface CategoryItemProps {
  category: CategoryWrapped;
  context: TransactionListPageContext;
}

export function CategoryItem({
  category,
  context,
}: CategoryItemProps) {
  const [folded, setFolded] = useState(true);

  const fetchApplyScanned = async () => {
    await fetch('/api/categorize/apply', {
      method: 'POST',
      body: JSON.stringify({
        categoryId: category.id,
      }),
    });
  }

  return (
    <div>
      <div onClick={() => setFolded(!folded)} className='hover:bg-half-dark-white/40 hover:cursor-pointer px-0.5 py-0.5'>
        <div className='inline-block w-52'>
          {category.name}
        </div>
        <span className='text-sm'>
          <CategoryLabel category={category} />
        </span>
      </div>

      {
        !folded && (<>
          <div>
            {
              category.rules.map((rule, i) => (
                <div key={`${category.name}:rule:${i}`} className='ml-2 flex flex-row text-sm'>
                  <div className='mr-1'>
                    OR
                  </div>

                  <div>
                    {
                      rule.pairs.map((pair, j) => (
                        <div key={`${category.name}:rule:${i}:pair:${j}`} className='ml-2 flex flex-row'>
                          <div className='mr-1'>
                            AND
                          </div>
                          <div>
                            {pair.key} =~ <span className='bg-half-dark-white/10 px-1'>{pair.value}</span>
                          </div>
                        </div>
                      ))
                    }
                  </div>
                </div>
              ))
            }
          </div>

          <Link
            href={`/dashboard/transaction?${CategoryParams.merge(context.props.searchParams, {
              edit: category.id,
              create: null,
            })}`}
            className='block w-full text-center bg-half-dark-yellow/50 hover:bg-half-dark-yellow/70 text-sm uppercase'
          >
            edit
          </Link>

          {
            context.categoryParams.scan === category.id ? (
              <button onClick={fetchApplyScanned} className='block w-full text-center bg-half-dark-red/50 hover:bg-half-dark-red/70 text-sm uppercase cursor-pointer'>
                apply
              </button>

            ) : (
              <Link
                href={`/dashboard/transaction?${CategoryParams.merge(context.props.searchParams, {
                  scan: category.id,
                })}`}
                className='block w-full text-center bg-half-dark-green/50 hover:bg-half-dark-green/70 text-sm uppercase'
              >
                test
              </Link>
            )
          }
        </>)
      }
    </div>
  )
}