'use client';

import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import classNames from 'classnames';
import { CategoryWrapped, checkRules, formatDate, lerpAmount } from '@/lib/utils';
import { TransactionWithCategories } from '@/lib/db/transaction';

interface TransactionTableProps {
  transactions: TransactionWithCategories[];
  categories: CategoryWrapped[];
  scanFor?: string;
}

export function TransactionTable({
  transactions,
  categories,
  scanFor,
}: TransactionTableProps) {

  const columnHelper = createColumnHelper<TransactionWithCategories>();
  const columns = [
    columnHelper.accessor('date', {
      cell: x => formatDate(x.getValue()),
    }),
    columnHelper.accessor('kind', {
      cell: x => <div className='text-sm'>{x.getValue()}</div>
    }),
    columnHelper.accessor('categories', {
      header: 'categories',
      cell: x => (
        <div className={classNames('text-sm', {
          'bg-half-dark-red/10': x.getValue()?.length === 0,
        })}>
          {x.getValue()?.length === 0 && (
            <div className='text-center'>Uncategorized</div>
          )}
          {x.getValue()?.map(category => (
            <div key={category.categoryId} style={{
              display: 'inline-block',
              backgroundColor: `${category.category.color}55`,
            }}>
              {category.category.label}
            </div>
          ))}
        </div>
      ),
    }),
    columnHelper.accessor('content', {
      cell: x => <div className='text-sm'>{x.getValue()}</div>
    }),
    columnHelper.accessor('amount', {
      meta: {
        align: 'right',
      },
      cell: x => <div style={{ color: lerpAmount(-30000, 100000, x.getValue()) }}>{x.getValue()}</div>,
    }),
    columnHelper.accessor('balance', {
      meta: {
        align: 'right',
      },
    }),
  ];

  const table = useReactTable({
    data: transactions,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const scanCategrory = categories.find(x => x.name === scanFor);

  return (
    <table className='w-full'>
      <thead className='uppercase border-b border-half-dark-white'>
        {table.getHeaderGroups().map(headerGroup => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map(header => (
              <th key={header.id} className='px-6 py-2'>
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
                <td key={cell.id} className={classNames('px-2 pt-1 pb-0.5 align-middle', {
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
  )
}