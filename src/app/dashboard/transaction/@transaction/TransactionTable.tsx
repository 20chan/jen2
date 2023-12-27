'use client';

import { createColumnHelper, flexRender, getCoreRowModel, getExpandedRowModel, useReactTable } from '@tanstack/react-table';
import classNames from 'classnames';
import { CategoryWrapped, checkRules, formatDate, formatDateKr, lerpAmount, sortCategories, transactionToModel } from '@/lib/utils';
import type { TransactionModel } from '@/lib/db/transaction';
import { useMemo, useState } from 'react';
import { EditCategoryMenu } from './EditCategoryMenu';
import { CategoryLabel } from '../CategoryLabel';
import { TransactionListPageContext } from '../TransactionListPageContext';
import { TransactionMemo } from './TransactionMemo';
import { useRouter } from 'next/navigation';
import { TransactionAmount } from './TransactionAmount';

interface TransactionTableProps {
  transactions: TransactionModel[];
  categories: CategoryWrapped[];
  context: TransactionListPageContext;
}

export function TransactionTable({
  transactions,
  categories,
  context,
}: TransactionTableProps) {
  const [selectedTransaction, setSelectedTransaction] = useState<TransactionModel | null>(null);
  const [showEditMenu, setShowEditMenu] = useState(false);
  const [editMenuPosition, setEditMenuPosition] = useState({ top: 0, left: 0 });
  const router = useRouter();

  const handleEditMenu = (transaction: TransactionModel) => {
    return (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      setSelectedTransaction(transaction);
      setShowEditMenu(true);
      setEditMenuPosition({
        top: e.pageY,
        left: e.pageX,
      });
    }
  }

  const lazyUpdate = async (transaction: TransactionModel) => {
    const resp = await fetch('/api/transaction', {
      method: 'PUT',
      body: JSON.stringify(transaction),
    });
    router.refresh();
  }

  const createSubTransaction = async (transaction: TransactionModel) => {
    const resp = await fetch('/api/transaction', {
      method: 'POST',
      body: JSON.stringify(transaction),
    });
    router.refresh();
  }

  const deleteSubTransaction = async (transaction: TransactionModel) => {
    const resp = await fetch('/api/transaction', {
      method: 'DELETE',
      body: JSON.stringify(transaction),
    });
    router.refresh();
  }

  const columnHelper = createColumnHelper<TransactionModel>();
  const columns = useMemo(() => {
    return [
      columnHelper.accessor('date', {
        cell: x => {
          const row = x.row.original;
          if (row.parent !== null) {
            return (
              <div className='text-right'>
                ㄴ
              </div>
            )
          }
          return (
            <div className='w-32'>
              {formatDateKr(x.getValue())}
            </div>
          );
        },
      }),
      columnHelper.accessor('kind', {
        cell: x => {
          const row = x.row.original;
          if (row.parent !== null) {
            return (
              <div className='text-right'>
              </div>
            )
          }
          return (
            <div className='text-sm w-28'>{x.getValue()}</div>
          );
        }
      }),
      columnHelper.accessor('categories', {
        header: 'categories',
        cell: x => {
          const row = x.row.original;
          const isParent = row.children.length > 0;
          const categories = x.getValue() ?? [];
          const categoryNotExists = categories.filter(y => !y.category.tag).length === 0;

          if (isParent) {
            const childrenSum = row.children.map(x => x.amount).reduce((a, b) => a + b, 0);
            const amountEqual = Math.abs(childrenSum - row.amount) < 0.0001;

            if (amountEqual) {
              return (
                <div />
              )
            } else {
              return (
                <div className='text-sm overflow-clip'>
                  {row.amount - childrenSum}
                </div>
              );

            }
          }
          return (
            <div onClick={handleEditMenu(x.row.original)} className={classNames('text-sm cursor-pointer', {
              'bg-half-dark-red/10': categoryNotExists,
            })}>
              <div className='flex flex-row gap-1 truncate overflow-clip'>
                {
                  categoryNotExists && (
                    <div className='text-center flex-1'>Uncategorized</div>
                  )
                }
                {
                  sortCategories(categories.map(x => x.category)).map(category => (
                    <CategoryLabel key={category.id} category={category} />
                  ))
                }
              </div>
            </div>
          );
        },
      }),
      columnHelper.accessor('content', {
        cell: x => <div className='text-sm w-32 truncate hover:overflow-visible'>{x.getValue()}</div>
      }),
      columnHelper.accessor('memo', {
        cell: x => {
          const initialValue = x.getValue();

          return (
            <TransactionMemo memo={initialValue} update={memo => lazyUpdate({ ...x.row.original, memo })} />
          );
        }
      }),
      columnHelper.accessor('amount', {
        meta: {
          align: 'right',
        },
        cell: x => {
          const row = x.row.original;
          const isChild = row.parent !== null;

          if (isChild) {
            return (
              <div style={{ color: lerpAmount(-30000, 100000, x.getValue()) }}>
                <div className='w-16'>
                  <TransactionAmount amount={x.getValue()} update={amount => lazyUpdate({ ...x.row.original, amount })} />
                </div>
              </div>
            )
          }

          return (
            <div style={{ color: lerpAmount(-30000, 100000, x.getValue()) }}>
              <div className='w-16'>
                {x.getValue()}
              </div>
            </div>
          );
        },
      }),
      columnHelper.accessor('balance', {
        meta: {
          align: 'right',
        },
        cell: x => {
          const row = x.row.original;

          const value = row.parent != null ? (
            row.parent.balance
          ) : (
            row.balance
          );
          const onHover = (
            row.parent !== null ? (
              <button
                onClick={() => deleteSubTransaction(x.row.original)}
                className='font-bold text-half-red/50 hover:text-half-red/70'>
                DELETE
              </button>
            ) : (
              <button
                onClick={() => createSubTransaction(x.row.original)}
                className='font-bold text-half-blue/50 hover:text-half-blue/70'>
                SPLIT
              </button>
            )
          );

          return (
            <div className='w-20'>
              <div className='group-hover:block hidden'>
                {onHover}
              </div>
              <div className='group-hover:hidden'>
                {value}
              </div>
            </div>
          );
        },
      }),
    ];
  }, []);

  const data = useMemo(() => {
    return transactions.filter(x => x.parent === null);
  }, [transactions]);

  const table = useReactTable({
    data,
    state: {
      expanded: true,
    },
    columns,
    getSubRows: row => row.children.map(x => transactions.find(y => x.id === y.id) ?? transactionToModel(x, row)),
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
  });

  const scanCategrory = categories.find(x => x.id === context.categoryParams.scan);

  return (
    <div>
      <table className='w-full'>
        <thead className='uppercase border-b border-half-dark-white'>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th key={header.id} className='py-2'>
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map(row => {
            const isParent = row.original.children.length > 0;
            const childAmountSum = row.original.children.map(x => x.amount).reduce((a, b) => a + b, 0);
            const childAmountEquals = Math.abs(row.original.amount - childAmountSum) < 0.0001;

            const isChild = row.original.parent !== null;
            const scanMatch = scanCategrory && checkRules(scanCategrory.rules, row.original);
            return (
              <tr key={row.id} className={classNames('group border-b border-b-half-dark-white/25 hover:bg-half-dark-white/10', {
                'bg-half-dark-yellow/40 hover:bg-half-dark-yellow/60': scanMatch && !isParent,
                'bg-half-dark-green/10 hover:bg-half-dark-green/20': isParent && childAmountEquals,
                'bg-half-dark-red/20 hover:bg-half-dark-red/40': isParent && !childAmountEquals,
                'bg-half-dark-white/10 hover:bg-half-dark-white/20': isChild,
              })}>
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id} className={classNames('px-1.5 pt-1 pb-0.5 align-middle group', {
                    'text-right': (cell.column.columnDef.meta as any)?.align === 'right',
                  })}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>

      <div>
        <EditCategoryMenu
          transaction={selectedTransaction ?? transactions[0]}
          categories={categories}
          enabled={showEditMenu}
          setEnabled={setShowEditMenu}
          top={editMenuPosition.top}
          left={editMenuPosition.left} />
      </div>
    </div>
  )
}