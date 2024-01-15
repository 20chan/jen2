import { NextProps } from '@/lib/NextProps';
import { CategoryParams, PaginationParams } from '@/lib/params';

export type TransactionListPageContext = {
  props: NextProps;
  categoryParams: CategoryParams;
  paginationParams: PaginationParams;
};