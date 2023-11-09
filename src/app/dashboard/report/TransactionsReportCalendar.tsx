'use client';

import * as R from 'remeda';
import { Transaction } from '@prisma/client';
import { formatSimpleCurrency, getDay, moment } from '@/lib/utils';
import { useCalendar } from '@h6s/calendar';
import classNames from 'classnames';

export function TransactionsReportCalendar({
  transactions,
}: {
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

              return (
                <td key={key} className='w-20 py-2 align-top h-20 border-b border-b-half-dark-white/30'>
                  <div>
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
                              <div className='text-half-red/80'>
                                -{formatSimpleCurrency(Math.abs(dailyOutgoing))}
                              </div>
                            )}
                          </div>
                          {dailyIncoming > 0 && (
                            <div className='text-half-blue/80'>
                              +{formatSimpleCurrency(dailyIncoming)}
                            </div>
                          )}
                        </div>
                      )
                    }
                  </div>
                </td>
              )
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
}