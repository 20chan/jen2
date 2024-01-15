import { dateDiff, formatCurrency, formatDate, formatDateDiff } from '@/lib/utils';
import { client } from '@/lib/prisma';
import classNames from 'classnames';

export async function BalanceSummary() {
  const last = await client.transaction.findFirstOrThrow({
    select: {
      date: true,
      balance: true,
    },
    orderBy: {
      date: 'desc',
    },
  });

  return (
    <div className='flex flex-col'>
      <div>
        <span className='inline-block w-28'>현재 잔고:</span>
        <span className='font-bold'>{formatCurrency(last.balance)}원</span>
      </div>
      <div>
        <span className='inline-block w-28'>마지막 확인:</span>
        {formatDate(last.date)} <span className={classNames({
          'font-bold': true,
          'text-half-red': dateDiff(last.date) < -7,
        })}>({formatDateDiff(last.date)})</span>
      </div>
    </div >
  )
}