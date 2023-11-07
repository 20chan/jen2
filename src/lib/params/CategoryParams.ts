import { NextProps, NextSearchParams } from '../NextProps';

export interface CategoryParams {
  scan: number | null;
  edit: number | null;
}

export namespace CategoryParams {
  const schema = {
    scan: 'number?',
    edit: 'number?',
  } as const;

  export const defaultValue: CategoryParams = {
    scan: null,
    edit: null,
  };

  export const parse = (props: NextProps): CategoryParams => {
    return NextSearchParams.parse(props.searchParams, schema, defaultValue);
  };
}

