import { NextProps, NextSearchParams } from '../NextProps';

export interface ReportParams {
  where: string | null;

  day: number | null;
  categoryId: number | null;
}

export namespace ReportParams {
  const schema = {
    where: 'string?',
    day: 'number?',
    categoryId: 'number?',
  } as const;

  export const defaultValue: ReportParams = {
    where: null,
    day: null,
    categoryId: null,
  };

  export const parse = (props: NextProps): ReportParams => {
    return NextSearchParams.parse(props.searchParams, schema, defaultValue);
  };

  export const merge = (params: Partial<ReportParams>, searchParams?: NextSearchParams): string => {
    return NextSearchParams.merge(params, searchParams);
  }
}