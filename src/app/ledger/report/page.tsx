import * as R from 'remeda';
import { moment } from '@/lib/utils';
import { NextProps } from '@/lib/NextProps';
import { TransactionsReport } from './TransactionsReport';
import { fetchTransactionModels } from '@/lib/db/transaction';
import { fetchCategoriesWrapped } from '@/lib/db/category';
import { ReportParams } from '@/lib/params/ReportParams';
import { TransactionSideView } from './TransactionsSideView';

const fetchData = async () => {
  return {
    transactions: await fetchTransactionModels(),
    categories: await fetchCategoriesWrapped(),
  }
};

type MonthlyReportProps = NextProps & {
};

export default async function MonthlyReportPage(props: MonthlyReportProps) {
  const context = {
    reportParams: ReportParams.parse(props),
  };

  const { transactions, categories } = await fetchData();

  const months = R.pipe(
    transactions,
    R.groupBy(x => moment(x.date).format('YYYY-MM')),
  );

  const sideviewEnabled = context.reportParams.where !== null;

  return (
    <div className='relative flex flex-row'>
      <div className='flex flex-col gap-24'>
        {Object.entries(months).map(([month, transactions]) => (
          <div key={month}>
            <TransactionsReport month={month} transactions={transactions} categories={categories} />
          </div>
        ))}
      </div>

      {
        sideviewEnabled && (
          <div className='fixed right-4 top-16 bottom-5 w-[28rem] border-l-2 border-l-half-dark-white/50 pl-4 overflow-x-visible overflow-y-auto'>
            <div className='text-2xl text-center'>
              {
                context.reportParams.day && (
                  `${context.reportParams.where}-${context.reportParams.day.toString().padStart(2, '0')}`
                )
              }

              {
                context.reportParams.categoryId && (
                  <>
                    {context.reportParams.where} {categories.find(x => x.id === context.reportParams.categoryId)?.label}
                  </>
                )
              }
            </div>
            <TransactionSideView
              transactions={transactions}
              categories={categories}
              reportParams={context.reportParams}
            />
          </div>
        )
      }
    </div>
  )
}