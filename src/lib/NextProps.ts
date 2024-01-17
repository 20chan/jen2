export type NextParams = { slug: string };
export type NextSearchParams = Record<string, string | string[]>;

export type NextProps = {
  params: NextParams
  searchParams: NextSearchParams
};

export namespace NextSearchParams {
  export const get = (searchProps: NextSearchParams, key: string): string[] | null => {
    const value = searchProps[key];

    if (value === undefined) {
      return null;
    }
    if (typeof value === 'string') return [value];
    if (Array.isArray(value)) return value;
    return null;
  };

  export const getStrings = get;

  export const getString = (searchProps: NextSearchParams, key: string): string | null => {
    const value = get(searchProps, key);

    if (value === null) {
      return null;
    }

    return value[0];
  };

  export const getNumbers = (searchProps: NextSearchParams, key: string): number[] => {
    // 하나라도 corrupted되면 아예 값을 버린다. 이하 동일
    const valueRaw = get(searchProps, key);

    if (valueRaw === null) {
      return [];
    }

    const value = valueRaw.map(value => parseInt(value));
    if (value.some(value => isNaN(value))) {
      return [];
    }

    return value;
  }

  export const getNumber = (searchProps: NextSearchParams, key: string): number | null => {
    const value = getNumbers(searchProps, key);

    if (value.length === 0) {
      return null;
    }

    return value[0];
  }

  export const getBooleans = (searchProps: NextSearchParams, key: string): boolean[] => {
    const valueRaw = get(searchProps, key);

    if (valueRaw === null) {
      return [];
    }

    // 빈 값은 true flag로 처리한다.
    const value = valueRaw.map(value => value === 'true' || value === '');
    if (value.some(value => typeof value !== 'boolean')) {
      return [];
    }

    return value;
  }

  export const getBoolean = (searchProps: NextSearchParams, key: string): boolean | null => {
    const value = getBooleans(searchProps, key);

    if (value.length === 0) {
      return null;
    }

    return value[0];
  }

  type SchemaValue = (
    | 'string'
    | 'string?'
    | 'string[]'
    | 'number'
    | 'number?'
    | 'number[]'
    | 'boolean'
    | 'boolean?'
    | 'boolean[]'
  );

  type ScheamValueType = (
    | string
    | string[]
    | number
    | number[]
    | boolean
    | boolean[]
    | null
  );

  type ParseSchemaValueType<T extends SchemaValue> = (
    T extends 'string' ? string :
    T extends 'string?' ? string | null :
    T extends 'string[]' ? string[] :
    T extends 'number' ? number :
    T extends 'number?' ? number | null :
    T extends 'number[]' ? number[] :
    T extends 'boolean' ? boolean :
    T extends 'boolean?' ? boolean | null :
    T extends 'boolean[]' ? boolean[] :
    never
  );

  type SchemaFieldDefinition = SchemaValue;

  type TSchemaBase = {
    [key: string]: SchemaFieldDefinition
  }

  type RawParseResult<TSchema extends TSchemaBase> = {
    [key in keyof TSchema]: ParseSchemaValueType<TSchema[key]>;
  }

  type SchemaDefaultValue<TSchema extends TSchemaBase> = Partial<RawParseResult<TSchema>>;

  type ExtractSchemaDefaultValueType<
    TSchema extends TSchemaBase,
    TDefaultValue extends SchemaDefaultValue<TSchema>,
    key extends keyof TSchema,
  > = TDefaultValue[key] extends undefined ? null : TDefaultValue[key];

  type ParseResult<TSchema extends TSchemaBase, TDefaultValue extends SchemaDefaultValue<TSchema>> = {
    [key in keyof TSchema]: ExtractSchemaDefaultValueType<TSchema, TDefaultValue, key>;
  };

  export const parse = <TSchema extends TSchemaBase, TDefaultValue extends SchemaDefaultValue<TSchema>>(
    searchProps: NextSearchParams,
    schema: TSchema,
    defaultValue?: TDefaultValue,
  ): ParseResult<TSchema, TDefaultValue> => {
    const result = {} as ParseResult<TSchema, TDefaultValue>;

    for (const key in schema) {
      const type = schema[key];
      const fallback = defaultValue?.[key] === undefined ? null : defaultValue[key];

      if (type === 'string[]') {
        result[key] = (getStrings(searchProps, key) ?? fallback) as any;
      } else if (type === 'string' || type === 'string?') {
        result[key] = (getString(searchProps, key) ?? fallback) as any;
      } else if (type === 'number[]') {
        result[key] = (getNumbers(searchProps, key) ?? fallback) as any;
      } else if (type === 'number' || type === 'number?') {
        result[key] = (getNumber(searchProps, key) ?? fallback) as any;
      } else if (type === 'boolean[]') {
        result[key] = (getBooleans(searchProps, key) ?? fallback) as any;
      } else if (type === 'boolean' || type === 'boolean?') {
        result[key] = (getBoolean(searchProps, key) ?? fallback) as any;
      } else {
        throw new Error(`Invalid schema value: ${type}`);
      }
    }

    return result;
  };

  export const qsfy = (searchParams: NextSearchParams): URLSearchParams => {
    const qs = new URLSearchParams();

    for (const key in searchParams) {
      const value = searchParams[key];
      if (value === null) {
        continue;
      }
      if (typeof value === 'string') {
        qs.append(key, value);
      } else if (Array.isArray(value)) {
        for (const valueElement of value) {
          qs.append(key, valueElement);
        }
      }
    }

    return qs;
  };

  export const merge = <TValue extends Record<string, ScheamValueType>>(
    params: TValue,
    searchParams?: NextSearchParams,
  ): string => {
    const qs = searchParams ? qsfy(searchParams) : new URLSearchParams();

    for (const key in params) {
      if (qs.has(key)) {
        qs.delete(key);
      }
      const value = params[key];
      if (value === null) {
        continue;
      }
      if (typeof value === 'string') {
        qs.append(key, value);
      } else if (typeof value === 'number') {
        qs.append(key, value.toString());
      } else if (typeof value === 'boolean') {
        qs.append(key, value.toString());
      } else if (Array.isArray(value)) {
        for (const valueElement of value) {
          if (typeof valueElement === 'string') {
            qs.append(key, valueElement);
          } else if (typeof valueElement === 'number') {
            qs.append(key, valueElement.toString());
          } else if (typeof valueElement === 'boolean') {
            qs.append(key, valueElement.toString());
          } else {
            throw new Error(`Invalid value element: ${valueElement}`);
          }
        }
      } else {
        throw new Error(`Invalid value: ${value}`);
      }
    }

    return qs.toString();
  };
}