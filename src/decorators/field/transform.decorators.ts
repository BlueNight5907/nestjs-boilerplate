import { Transform } from 'class-transformer';
import { parseQueryStringToObject } from 'common/utils';
import { type Constructor } from 'definitions/@types';
import { parsePhoneNumber } from 'libphonenumber-js';
import { castArray, isArray, isNil, map, trim } from 'lodash';
import { type IParseOptions } from 'qs';

/**
 * @description trim spaces from start and end, replace multiple spaces with one.
 * @example
 * @ApiProperty()
 * @IsString()
 * @Trim()
 * name: string;
 * @returns PropertyDecorator
 * @constructor
 */
export function Trim(): PropertyDecorator {
  return Transform((params) => {
    const value = params.value as string[] | string;

    if (isArray(value)) {
      return map(value, (v) => trim(v).replaceAll(/\s\s+/g, ' '));
    }

    return trim(value).replaceAll(/\s\s+/g, ' ');
  });
}

export function ToBoolean(): PropertyDecorator {
  return Transform(
    (params): unknown => {
      switch (params.value) {
        case 'true': {
          return true;
        }

        case 'false': {
          return false;
        }

        case '1': {
          return true;
        }

        case '0': {
          return false;
        }

        case 1: {
          return true;
        }

        case 0: {
          return false;
        }

        default: {
          return params.value;
        }
      }
    },
    { toClassOnly: true },
  );
}

/**
 * @description convert string or number to integer
 * @example
 * @IsNumber()
 * @ToInt()
 * name: number;
 * @returns PropertyDecorator
 * @constructor
 */
export function ToInt(): PropertyDecorator {
  return Transform(
    (params) => {
      const value = params.value as string;

      return Number.parseInt(value, 10);
    },
    { toClassOnly: true },
  );
}

/**
 * @description transforms to array, specially for query params
 * @example
 * @IsNumber()
 * @ToArray()
 * name: number;
 * @constructor
 */
export function ToArray<T>(): PropertyDecorator {
  return Transform(
    (params) => {
      const value = params.value as T;

      if (isNil(value)) {
        return [];
      }

      return castArray(value);
    },
    { toClassOnly: true },
  );
}

export function ToLowerCase(): PropertyDecorator {
  return Transform(
    (params) => {
      const value = params.value as string | string[];

      if (!value) {
        return;
      }

      if (!Array.isArray(value)) {
        return value.toLowerCase();
      }

      return value.map((v) => v.toLowerCase());
    },
    {
      toClassOnly: true,
    },
  );
}

export function ToUpperCase(): PropertyDecorator {
  return Transform(
    (params) => {
      const value = params.value as string | string[];

      if (!value) {
        return;
      }

      if (!Array.isArray(value)) {
        return value.toUpperCase();
      }

      return value.map((v) => v.toUpperCase());
    },
    {
      toClassOnly: true,
    },
  );
}

export function PhoneNumberSerializer(): PropertyDecorator {
  return Transform((params) => parsePhoneNumber(params.value as string).number);
}

export function QueryStringParser<TClass extends Constructor>(
  options?: IParseOptions & {
    isArray?: boolean;
    fallback?: unknown;
    getClass?: () => TClass;
  },
): PropertyDecorator {
  return Transform(
    (params): unknown => {
      if (!options?.isArray) {
        return parseQueryStringToObject(params.value, options);
      }

      try {
        const arr = params.value as unknown[];

        return arr.map((item) => parseQueryStringToObject(item, options));
      } catch {
        return undefined;
      }
    },
    { toClassOnly: true },
  );
}
