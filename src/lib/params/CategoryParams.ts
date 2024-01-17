import { NextProps, NextSearchParams } from '../NextProps';

export interface CategoryParams {
  scan: number | null;
  edit: number | null;
  create: boolean | null;
}

export namespace CategoryParams {
  const schema = {
    scan: 'number?',
    edit: 'number?',
    create: 'boolean?',
  } as const;

  export const defaultValue: CategoryParams = {
    scan: null,
    edit: null,
    create: null,
  };

  export const parse = (props: NextProps): CategoryParams => {
    return NextSearchParams.parse(props.searchParams, schema, defaultValue);
  };

  export const merge = (params: Partial<CategoryParams>, searchParams?: NextSearchParams): string => {
    return NextSearchParams.merge(params, searchParams);
  }
}

