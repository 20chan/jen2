import * as R from 'remeda';
import { moment } from '@/lib/utils';
import { NextProps } from '@/lib/NextProps';
import { TransactionsReport } from './TransactionsReport';
import { fetchTransactionsWithCategories } from '@/lib/db/transaction';
import { fetchCategoriesWrapped } from '@/lib/db/category';

const fetchData = async () => {
  return {
    transactions: await fetchTransactionsWithCategories(),
    categories: await fetchCategoriesWrapped(),
  }
};

type MonthlyReportProps = NextProps & {
};

export default async function MonthlyReportPage(props: MonthlyReportProps) {
  const { transactions, categories } = await fetchData();

  const months = R.pipe(
    transactions,
    R.groupBy(x => moment(x.date).format('YYYY-MM')),
  );

  return (
    <div className='flex flex-col gap-24'>
      {Object.entries(months).map(([month, transactions]) => (
        <div key={month}>
          <TransactionsReport transactions={transactions} categories={categories} />
        </div>
      ))}
    </div>
  )
}