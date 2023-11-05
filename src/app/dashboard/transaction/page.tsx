import { TransactionTable } from './TransactionTable';
import { CategoryList } from './CategoryList';
import { fetchTransactionsWithCategories } from '@/lib/db/transaction';
import { fetchCategoriesWrapped } from '@/lib/db/category';
import { NextProps } from '@/lib/NextProps';

export default async function TransactionListPage(props: NextProps) {
  const transactions = await fetchTransactionsWithCategories();
  const categories = await fetchCategoriesWrapped();

  const scanFor = props.searchParams['scanfor'];

  return (
    <div className='flex flex-row'>
      <div>
        <TransactionTable transactions={[...transactions].slice(0, 100)} categories={categories} scanFor={scanFor} />
      </div>
      <div className='ml-4 border-l border-l-half-dark-white/50 px-4'>
        <CategoryList categories={categories} scanFor={scanFor} />
      </div>
    </div>
  )
}