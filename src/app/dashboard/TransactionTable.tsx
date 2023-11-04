'use client';

import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import classNames from 'classnames';
import { Transaction } from '@prisma/client';
import { formatDate, lerpAmount } from '@/lib/utils';

interface TransactionTableProps {
  transactions: Transaction[];
}

export function TransactionTable(props: TransactionTableProps) {
  const { transactions } = props;

  const columnHelper = createColumnHelper<Transaction>();
  const columns = [
    columnHelper.accessor('date', {
      cell: x => formatDate(x.getValue()),
    }),
    columnHelper.accessor('kind', {
      cell: x => <div className='text-sm'>{x.getValue()}</div>
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

  return (
    <table className='w-full'>
      <thead className='uppercase border-b border-half-dark-white'>
        {table.getHeaderGroups().map(headerGroup => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map(header => (
              <th key={header.id} className='px-6 py-3'>
                {flexRender(header.column.columnDef.header, header.getContext())}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map(row => (
          <tr key={row.id} className='border-b border-b-half-dark-white/25 hover:bg-half-dark-white/10'>
            {row.getVisibleCells().map(cell => (
              <td key={cell.id} className={classNames('px-2 py-0.5', {
                'text-right': (cell.column.columnDef.meta as any)?.align === 'right',
              })}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>

        ))}
      </tbody>
    </table>
  )
}