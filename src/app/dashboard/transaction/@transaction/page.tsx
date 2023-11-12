import { TransactionTable } from './TransactionTable';
import { fetchTransactionsWithCategories } from '@/lib/db/transaction';
import { fetchCategoriesWrapped } from '@/lib/db/category';
import { NextProps } from '@/lib/NextProps';
import { CategoryParams } from '@/lib/params';
import { PaginationParams } from '@/lib/params/PaginationParams';
import Link from 'next/link';

const fetchData = async (page: number) => {
  const transactions = await fetchTransactionsWithCategories({
    skip: (page - 1) * 100,
    take: 100,
  });
  const categories = await fetchCategoriesWrapped();
  return {
    transactions,
    categories,
  };
};

export const preload = (page: number) => {
  void fetchData(page);
}

export default async function TransactionListPage(props: NextProps) {
  const context = {
    props,
    categoryParams: CategoryParams.parse(props),
    paginationParams: PaginationParams.parse(props),
  };

  const { transactions, categories } = await fetchData(context.paginationParams.page);

  return (
    <div>
      <TransactionTable transactions={[...transactions].slice(0, 100)} categories={categories} context={context} />
      <div className='flex flex-row items-stretch justify-stretch'>
        <Link href={`/dashboard/transaction?${PaginationParams.merge(context.props.searchParams, {
          page: context.paginationParams.page - 1,
        })}`} className='flex-1 bg-half-dark-green/50 hover:bg-half-dark-green/70 py-1 text-center'>
          {'<'}
        </Link>
        <Link href={`/dashboard/transaction?${PaginationParams.merge(context.props.searchParams, {
          page: context.paginationParams.page + 1,
        })}`} className='flex-1 bg-half-dark-green/50 hover:bg-half-dark-green/70 py-1 text-center'>
          {'>'}
        </Link>
      </div>
    </div>
  )
}