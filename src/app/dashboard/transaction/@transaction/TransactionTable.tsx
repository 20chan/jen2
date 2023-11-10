'use client';

import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import classNames from 'classnames';
import { CategoryWrapped, checkRules, formatDate, formatDateKr, lerpAmount, sortCategories } from '@/lib/utils';
import { TransactionWithCategories } from '@/lib/db/transaction';
import { useEffect, useState } from 'react';
import { EditCategoryMenu } from './EditCategoryMenu';
import { CategoryLabel } from '../CategoryLabel';
import { CategoryParams } from '@/lib/params';
import { TransactionListPageContext } from '../TransactionListPageContext';
import { TransactionMemo } from './TransactionMemo';

interface TransactionTableProps {
  transactions: TransactionWithCategories[];
  categories: CategoryWrapped[];
  context: TransactionListPageContext;
}

export function TransactionTable({
  transactions,
  categories,
  context,
}: TransactionTableProps) {
  const [selectedTransaction, setSelectedTransaction] = useState<TransactionWithCategories | null>(null);
  const [showEditMenu, setShowEditMenu] = useState(false);
  const [editMenuPosition, setEditMenuPosition] = useState({ top: 0, left: 0 });

  const handleEditMenu = (transaction: TransactionWithCategories) => {
    return (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      setSelectedTransaction(transaction);
      setShowEditMenu(true);
      setEditMenuPosition({
        top: e.pageY,
        left: e.pageX,
      });
    }
  }

  const lazyUpdate = async (transaction: TransactionWithCategories) => {
    const resp = await fetch('/api/transaction', {
      method: 'PUT',
      body: JSON.stringify(transaction),
    });
  }

  const columnHelper = createColumnHelper<TransactionWithCategories>();
  const columns = [
    columnHelper.accessor('date', {
      cell: x => <div className='w-32'>
        {formatDateKr(x.getValue())}
      </div>,
    }),
    columnHelper.accessor('kind', {
      cell: x => <div className='text-sm w-28'>{x.getValue()}</div>
    }),
    columnHelper.accessor('categories', {
      header: 'categories',
      cell: x => {
        const categories = x.getValue() ?? [];
        const categoryNotExists = categories.filter(y => !y.category.tag).length === 0;
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
      cell: x => <div style={{ color: lerpAmount(-30000, 100000, x.getValue()) }}>
        <div className='w-16'>
          {x.getValue()}
        </div>
      </div>,
    }),
    columnHelper.accessor('balance', {
      meta: {
        align: 'right',
      },
      cell: x => <div className='w-20'>
        {x.getValue()}
      </div>,
    }),
  ];

  const table = useReactTable({
    data: transactions,
    columns,
    getCoreRowModel: getCoreRowModel(),
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
            const scanMatch = scanCategrory && checkRules(scanCategrory.rules, row.original);
            return (
              <tr key={row.id} className={classNames('border-b border-b-half-dark-white/25 hover:bg-half-dark-white/10', {
                'bg-half-dark-yellow/40': scanMatch,
                'hover:bg-half-dark-yellow/60': scanMatch,
              })}>
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id} className={classNames('px-1.5 pt-1 pb-0.5 align-middle', {
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