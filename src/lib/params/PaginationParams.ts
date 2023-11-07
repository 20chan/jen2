import { NextProps, NextSearchParams } from '../NextProps';

export interface PaginationParams {
  page: number;
}

export namespace PaginationParams {
  const schema = {
    page: 'number',
  } as const;

  export const defaultValue: PaginationParams = {
    page: 1,
  };

  export const parse = (props: NextProps): PaginationParams => {
    return NextSearchParams.parse(props.searchParams, schema, defaultValue);
  };
}