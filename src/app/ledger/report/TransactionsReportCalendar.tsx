'use client';

import * as R from 'remeda';
import { Transaction } from '@prisma/client';
import { formatSimpleCurrency, getDay, lerpAmount, moment } from '@/lib/utils';
import { useCalendar } from '@h6s/calendar';
import classNames from 'classnames';
import Link from 'next/link';
import { ReportParams } from '@/lib/params/ReportParams';

export function TransactionsReportCalendar({
  month,
  transactions,
}: {
  month: string;
  transactions: Transaction[];
}) {
  const { headers, body, view } = useCalendar({
    defaultDate: transactions[0].date,
  });

  return (
    <table>
      <thead>
        <tr className='border-b border-b-half-dark-white/30'>
          {headers.weekDays.map(({ key, value }) => {
            return (
              <th key={key} className='text-center text-lg pt-1'>
                {getDay(value)}
              </th>
            )
          })}
        </tr>
      </thead>
      <tbody>
        {body.value.map(({ key, value: days }) => (
          <tr key={key}>
            {days.map(({ key, value, isCurrentMonth }) => {

              const dailyTransactions = transactions.filter(x => moment(x.date).isSame(value, 'day'));
              const dailyIncoming = R.sumBy(dailyTransactions.filter(x => x.amount > 0), x => x.amount);
              const dailyOutgoing = R.sumBy(dailyTransactions.filter(x => x.amount < 0), x => x.amount);

              const isToday = moment().isSame(value, 'day');

              return (
                <td key={key} className={classNames('w-20 align-top h-20 border-b border-b-half-dark-white/30 hover:bg-half-dark-white/10', {
                  'bg-half-dark-white/20': isToday,
                })}>
                  <Link href={`/ledger/report?${ReportParams.merge({ where: month, day: value.getDate() })}`} className='py-2 block w-full h-full'>
                    <div className={classNames('text-center text-lg', {
                      'text-half-white/40': !isCurrentMonth,
                    })}>
                      {value.getDate()}
                    </div>
                    {
                      isCurrentMonth && (
                        <div className='text-center text-xs'>
                          <div className='min-h-[1rem]'>
                            {dailyOutgoing < 0 && (
                              <div style={{ color: lerpAmount(-70000, 100000, dailyOutgoing) }}>
                                -{formatSimpleCurrency(Math.abs(dailyOutgoing))}
                              </div>
                            )}
                          </div>
                          {dailyIncoming > 0 && (
                            <div style={{ color: lerpAmount(-70000, 100000, dailyIncoming) }}>
                              +{formatSimpleCurrency(dailyIncoming)}
                            </div>
                          )}
                        </div>
                      )
                    }
                  </Link>
                </td>
              )
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
}