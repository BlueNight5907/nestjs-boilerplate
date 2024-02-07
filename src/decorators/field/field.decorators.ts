/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable unicorn/no-null */
import { applyDecorators } from '@nestjs/common';
import { ApiProperty, type ApiPropertyOptions } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsBoolean,
  IsDate,
  IsDefined,
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  IsUrl,
  IsUUID,
  Max,
  MaxLength,
  Min,
  MinLength,
  NotEquals,
  ValidateNested,
} from 'class-validator';
import { supportedLanguageCount } from 'enums';
import { i18nValidationMessage } from 'nestjs-i18n';
import { COMMON_VALIDATION_KEY } from 'translation-keys';
import { type Constructor } from 'types';

import { ApiEnumProperty, ApiUUIDProperty } from './property.decorators';
import {
  PhoneNumberSerializer,
  ToArray,
  ToBoolean,
  ToLowerCase,
  ToUpperCase,
} from './transform.decorators';
import {
  IsNullable,
  IsPassword,
  IsPhoneNumber,
  IsTmpKey as IsTemporaryKey,
  IsUndefinable,
} from './validator.decorators';

type RequireField<T, K extends keyof T> = T & Required<Pick<T, K>>;

interface IFieldOptions {
  each?: boolean;
  swagger?: boolean;
  nullable?: boolean;
  groups?: string[];
}

interface INumberFieldOptions extends IFieldOptions {
  min?: number;
  max?: number;
  int?: boolean;
  isPositive?: boolean;
}

interface IStringFieldOptions extends IFieldOptions {
  minLength?: number;
  maxLength?: number;
  toLowerCase?: boolean;
  toUpperCase?: boolean;
}

type IClassFieldOptions = IFieldOptions;
type IBooleanFieldOptions = IFieldOptions;
type IEnumFieldOptions = IFieldOptions;

export function NumberField(
  options: Omit<ApiPropertyOptions, 'type'> & INumberFieldOptions = {},
): PropertyDecorator {
  const decorators = [
    IsDefined({
      each: options.each,
      message: i18nValidationMessage(COMMON_VALIDATION_KEY.NOT_EMPTY),
    }),
    Type(() => Number),
  ];

  if (options.nullable) {
    decorators.push(IsNullable({ each: options.each }));
  } else {
    decorators.push(
      NotEquals(null, {
        each: options.each,
        message: i18nValidationMessage(COMMON_VALIDATION_KEY.NOT_NULL),
      }),
    );
  }

  if (options.swagger !== false) {
    decorators.push(ApiProperty({ type: Number, ...options }));
  }

  if (options.each) {
    decorators.push(ToArray());
  }

  if (options.int) {
    decorators.push(
      IsInt({
        each: options.each,
        message: i18nValidationMessage(COMMON_VALIDATION_KEY.INVALID_INTEGER),
      }),
    );
  } else {
    decorators.push(
      IsNumber(
        {},
        {
          each: options.each,
          message: i18nValidationMessage(COMMON_VALIDATION_KEY.INVALID_NUMBER),
        },
      ),
    );
  }

  if (typeof options.min === 'number') {
    decorators.push(
      Min(options.min, {
        each: options.each,
        message: i18nValidationMessage(COMMON_VALIDATION_KEY.MIN),
      }),
    );
  }

  if (typeof options.max === 'number') {
    decorators.push(
      Max(options.max, {
        each: options.each,
        message: i18nValidationMessage(COMMON_VALIDATION_KEY.MAX),
      }),
    );
  }

  if (options.isPositive) {
    decorators.push(
      IsPositive({
        each: options.each,
        message: i18nValidationMessage(COMMON_VALIDATION_KEY.POSITIVE),
      }),
    );
  }

  return applyDecorators(...decorators);
}

export function NumberFieldOptional(
  options: Omit<ApiPropertyOptions, 'type' | 'required'> &
    INumberFieldOptions = {},
): PropertyDecorator {
  return applyDecorators(
    IsUndefinable(),
    NumberField({ required: false, ...options }),
  );
}

export function StringField(
  options: Omit<ApiPropertyOptions, 'type'> & IStringFieldOptions = {},
): PropertyDecorator {
  const decorators: PropertyDecorator[] = [
    IsNotEmpty({
      each: options.each,
      message: i18nValidationMessage(COMMON_VALIDATION_KEY.NOT_EMPTY),
    }),
    Type(() => String),
    IsString({
      each: options.each,
      message: i18nValidationMessage(COMMON_VALIDATION_KEY.INVALID_STRING),
    }),
  ];

  if (options.nullable) {
    decorators.push(IsNullable({ each: options.each }));
  } else {
    decorators.push(
      NotEquals(null, {
        each: options.each,
        message: i18nValidationMessage(COMMON_VALIDATION_KEY.NOT_NULL),
      }),
    );
  }

  if (options.swagger !== false) {
    decorators.push(
      ApiProperty({ type: String, ...options, isArray: options.each }),
    );
  }

  const minLength = options.minLength || 1;

  decorators.push(
    MinLength(minLength, {
      each: options.each,
      message: i18nValidationMessage(COMMON_VALIDATION_KEY.MIN_LENGTH),
    }),
  );

  if (options.maxLength) {
    decorators.push(
      MaxLength(options.maxLength, {
        each: options.each,
        message: i18nValidationMessage(COMMON_VALIDATION_KEY.MAX_LENGTH),
      }),
    );
  }

  if (options.toLowerCase) {
    decorators.push(ToLowerCase());
  }

  if (options.toUpperCase) {
    decorators.push(ToUpperCase());
  }

  return applyDecorators(...decorators);
}

export function StringFieldOptional(
  options: Omit<ApiPropertyOptions, 'type' | 'required'> &
    IStringFieldOptions = {},
): PropertyDecorator {
  return applyDecorators(
    IsUndefinable(),
    StringField({ required: false, ...options }),
  );
}

export function PasswordField(
  options: Omit<ApiPropertyOptions, 'type' | 'minLength'> &
    IStringFieldOptions = {},
): PropertyDecorator {
  const decorators = [
    StringField({ ...options, minLength: 6 }),
    IsPassword({
      message: i18nValidationMessage(COMMON_VALIDATION_KEY.INVALID_PASSWORD),
    }),
  ];

  if (options.nullable) {
    decorators.push(IsNullable());
  } else {
    decorators.push(
      NotEquals(null, {
        message: i18nValidationMessage(COMMON_VALIDATION_KEY.NOT_NULL),
      }),
    );
  }

  return applyDecorators(...decorators);
}

export function PasswordFieldOptional(
  options: Omit<ApiPropertyOptions, 'type' | 'required' | 'minLength'> &
    IStringFieldOptions = {},
): PropertyDecorator {
  return applyDecorators(
    IsUndefinable(),
    PasswordField({ required: false, ...options }),
  );
}

export function BooleanField(
  options: Omit<ApiPropertyOptions, 'type'> & IBooleanFieldOptions = {},
): PropertyDecorator {
  const decorators = [
    IsDefined({
      each: options.each,
      message: i18nValidationMessage(COMMON_VALIDATION_KEY.NOT_EMPTY),
    }),
    ToBoolean(),
    IsBoolean({
      message: i18nValidationMessage(COMMON_VALIDATION_KEY.INVALID_BOOLEAN),
    }),
  ];

  if (options.nullable) {
    decorators.push(IsNullable());
  } else {
    decorators.push(
      NotEquals(null, {
        message: i18nValidationMessage(COMMON_VALIDATION_KEY.NOT_NULL),
      }),
    );
  }

  if (options.swagger !== false) {
    decorators.push(ApiProperty({ type: Boolean, ...options }));
  }

  return applyDecorators(...decorators);
}

export function BooleanFieldOptional(
  options: Omit<ApiPropertyOptions, 'type' | 'required'> &
    IBooleanFieldOptions = {},
): PropertyDecorator {
  return applyDecorators(
    IsUndefinable(),
    BooleanField({ required: false, ...options }),
  );
}

export function TranslationsField(
  options: RequireField<Omit<ApiPropertyOptions, 'isArray'>, 'type'> &
    IFieldOptions,
): PropertyDecorator {
  const decorators = [
    IsDefined({
      each: options.each,
      message: i18nValidationMessage(COMMON_VALIDATION_KEY.NOT_EMPTY),
    }),
    ArrayMinSize(supportedLanguageCount, {
      message: i18nValidationMessage(COMMON_VALIDATION_KEY.MIN_ITEMS),
    }),
    ArrayMaxSize(supportedLanguageCount, {
      message: i18nValidationMessage(COMMON_VALIDATION_KEY.MAX_ITEMS),
    }),
    ValidateNested({
      each: true,
    }),
    Type(() => options.type as FunctionConstructor),
  ];

  if (options.nullable) {
    decorators.push(IsNullable());
  } else {
    decorators.push(
      NotEquals(null, {
        message: i18nValidationMessage(COMMON_VALIDATION_KEY.NOT_NULL),
      }),
    );
  }

  if (options.swagger !== false) {
    decorators.push(ApiProperty({ isArray: true, ...options }));
  }

  return applyDecorators(...decorators);
}

export function TranslationsFieldOptional(
  options: RequireField<Omit<ApiPropertyOptions, 'isArray'>, 'type'> &
    IFieldOptions,
): PropertyDecorator {
  return applyDecorators(
    IsUndefinable(),
    TranslationsField({ required: false, ...options }),
  );
}

export function TmpKeyField(
  options: Omit<ApiPropertyOptions, 'type'> & IStringFieldOptions = {},
): PropertyDecorator {
  const decorators = [
    StringField(options),
    IsTemporaryKey({ each: options.each }),
  ];

  if (options.nullable) {
    decorators.push(IsNullable());
  } else {
    decorators.push(
      NotEquals(null, {
        message: i18nValidationMessage(COMMON_VALIDATION_KEY.NOT_NULL),
      }),
    );
  }

  if (options.swagger !== false) {
    decorators.push(
      ApiProperty({ type: String, ...options, isArray: options.each }),
    );
  }

  return applyDecorators(...decorators);
}

export function TmpKeyFieldOptional(
  options: Omit<ApiPropertyOptions, 'type' | 'required'> &
    IStringFieldOptions = {},
): PropertyDecorator {
  return applyDecorators(
    IsUndefinable(),
    TmpKeyField({ required: false, ...options }),
  );
}

export function EnumField<TEnum extends Record<string, unknown>>(
  getEnum: () => TEnum,
  options: Omit<ApiPropertyOptions, 'type' | 'enum' | 'enumName' | 'isArray'> &
    IEnumFieldOptions = {},
): PropertyDecorator {
  const enumValue = getEnum();
  const decorators = [
    IsDefined({
      each: options.each,
      message: i18nValidationMessage(COMMON_VALIDATION_KEY.NOT_EMPTY),
    }),
    IsEnum(enumValue, {
      each: options.each,
      message: i18nValidationMessage(COMMON_VALIDATION_KEY.INVALID_ENUM, {
        enumValues: Object.values(enumValue).join(', '),
      }),
    }),
  ];

  if (options.nullable) {
    decorators.push(IsNullable());
  } else {
    decorators.push(
      NotEquals(null, {
        message: i18nValidationMessage(COMMON_VALIDATION_KEY.NOT_NULL),
      }),
    );
  }

  if (options.each) {
    decorators.push(ToArray());
  }

  if (options.swagger !== false) {
    decorators.push(
      ApiEnumProperty(getEnum, { ...options, isArray: options.each }),
    );
  }

  return applyDecorators(...decorators);
}

export function ClassField<TClass extends Constructor>(
  getClass: () => TClass,
  options: Omit<ApiPropertyOptions, 'type'> & IClassFieldOptions = {},
): PropertyDecorator {
  const classValue = getClass();

  const decorators = [
    Type(() => classValue),
    ValidateNested({
      each: options.each,
      message: i18nValidationMessage(COMMON_VALIDATION_KEY.NESTED_CHILD),
    }),
  ];

  if (options.required !== false) {
    decorators.push(
      IsDefined({
        message: i18nValidationMessage(COMMON_VALIDATION_KEY.NOT_EMPTY),
      }),
    );
  }

  if (options.nullable) {
    decorators.push(IsNullable());
  } else {
    decorators.push(
      NotEquals(null, {
        message: i18nValidationMessage(COMMON_VALIDATION_KEY.NOT_NULL),
      }),
    );
  }

  if (options.swagger !== false) {
    decorators.push(
      ApiProperty({
        type: () => classValue,
        ...options,
      }),
    );
  }

  if (options.each) {
    decorators.push(ToArray());
  }

  return applyDecorators(...decorators);
}

export function EnumFieldOptional<TEnum extends Record<string, unknown>>(
  getEnum: () => TEnum,
  options: Omit<ApiPropertyOptions, 'type' | 'required' | 'enum' | 'enumName'> &
    IEnumFieldOptions = {},
): PropertyDecorator {
  return applyDecorators(
    IsUndefinable(),
    EnumField(getEnum, { required: false, ...options }),
  );
}

export function ClassFieldOptional<TClass extends Constructor>(
  getClass: () => TClass,
  options: Omit<ApiPropertyOptions, 'type' | 'required'> &
    IClassFieldOptions = {},
): PropertyDecorator {
  return applyDecorators(
    IsUndefinable(),
    ClassField(getClass, { required: false, ...options }),
  );
}

export function EmailField(
  options: Omit<ApiPropertyOptions, 'type'> & IStringFieldOptions = {},
): PropertyDecorator {
  const decorators = [
    IsEmail(
      {},
      {
        message: i18nValidationMessage(COMMON_VALIDATION_KEY.INVALID_EMAIL),
      },
    ),
    StringField({ toLowerCase: true, ...options }),
  ];

  if (options.nullable) {
    decorators.push(IsNullable());
  } else {
    decorators.push(NotEquals(null));
  }

  if (options.swagger !== false) {
    decorators.push(ApiProperty({ type: String, ...options }));
  }

  return applyDecorators(...decorators);
}

export function EmailFieldOptional(
  options: Omit<ApiPropertyOptions, 'type'> & IStringFieldOptions = {},
): PropertyDecorator {
  return applyDecorators(
    IsUndefinable(),
    EmailField({ required: false, ...options }),
  );
}

export function PhoneField(
  options: Omit<ApiPropertyOptions, 'type'> & IFieldOptions = {},
): PropertyDecorator {
  const decorators = [
    IsDefined({
      each: options.each,
      message: i18nValidationMessage(COMMON_VALIDATION_KEY.NOT_EMPTY),
    }),
    IsPhoneNumber({
      message: i18nValidationMessage(
        COMMON_VALIDATION_KEY.INVALID_PHONE_NUMBER,
      ),
    }),
    PhoneNumberSerializer(),
  ];

  if (options.nullable) {
    decorators.push(IsNullable());
  } else {
    decorators.push(
      NotEquals(null, {
        message: i18nValidationMessage(COMMON_VALIDATION_KEY.NOT_NULL),
      }),
    );
  }

  if (options.swagger !== false) {
    decorators.push(ApiProperty({ type: String, ...options }));
  }

  return applyDecorators(...decorators);
}

export function PhoneFieldOptional(
  options: Omit<ApiPropertyOptions, 'type' | 'required'> & IFieldOptions = {},
): PropertyDecorator {
  return applyDecorators(
    IsUndefinable(),
    PhoneField({ required: false, ...options }),
  );
}

export function UUIDField(
  options: Omit<ApiPropertyOptions, 'type' | 'format' | 'isArray'> &
    IFieldOptions = {},
): PropertyDecorator {
  const decorators = [
    IsDefined({
      each: options.each,
      message: i18nValidationMessage(COMMON_VALIDATION_KEY.NOT_EMPTY),
    }),
    Type(() => String),
    IsUUID('4', {
      each: options.each,
      message: i18nValidationMessage(COMMON_VALIDATION_KEY.INVALID_UUID),
    }),
  ];

  if (options.nullable) {
    decorators.push(IsNullable());
  } else {
    decorators.push(
      NotEquals(null, {
        message: i18nValidationMessage(COMMON_VALIDATION_KEY.NOT_NULL),
      }),
    );
  }

  if (options.swagger !== false) {
    decorators.push(ApiUUIDProperty(options));
  }

  if (options.each) {
    decorators.push(ToArray());
  }

  return applyDecorators(...decorators);
}

export function UUIDFieldOptional(
  options: Omit<ApiPropertyOptions, 'type' | 'required' | 'isArray'> &
    IFieldOptions = {},
): PropertyDecorator {
  return applyDecorators(
    IsUndefinable(),
    UUIDField({ required: false, ...options }),
  );
}

export function URLField(
  options: Omit<ApiPropertyOptions, 'type'> & IStringFieldOptions = {},
): PropertyDecorator {
  const decorators = [
    IsDefined({
      each: options.each,
      message: i18nValidationMessage(COMMON_VALIDATION_KEY.NOT_EMPTY),
    }),
    IsUrl(
      {},
      {
        each: true,
        message: i18nValidationMessage(COMMON_VALIDATION_KEY.INVALID_URL),
      },
    ),
  ];

  if (options.nullable) {
    decorators.push(IsNullable({ each: options.each }));
  } else {
    decorators.push(
      NotEquals(null, {
        each: options.each,
        message: i18nValidationMessage(COMMON_VALIDATION_KEY.NOT_NULL),
      }),
    );
  }

  return applyDecorators(...decorators);
}

export function URLFieldOptional(
  options: Omit<ApiPropertyOptions, 'type'> & IStringFieldOptions = {},
): PropertyDecorator {
  return applyDecorators(
    IsUndefinable(),
    URLField({ required: false, ...options }),
  );
}

export function DateField(
  options: Omit<ApiPropertyOptions, 'type'> & IFieldOptions = {},
): PropertyDecorator {
  const decorators = [
    IsDefined({
      each: options.each,
      message: i18nValidationMessage(COMMON_VALIDATION_KEY.NOT_EMPTY),
    }),
    Type(() => Date),
    IsDate({
      message: i18nValidationMessage(COMMON_VALIDATION_KEY.INVALID_DATE),
    }),
  ];

  if (options.nullable) {
    decorators.push(IsNullable());
  } else {
    decorators.push(
      NotEquals(null, {
        message: i18nValidationMessage(COMMON_VALIDATION_KEY.NOT_NULL),
      }),
    );
  }

  if (options.swagger !== false) {
    decorators.push(ApiProperty({ type: Date, ...options }));
  }

  return applyDecorators(...decorators);
}

export function DateFieldOptional(
  options: Omit<ApiPropertyOptions, 'type' | 'required'> & IFieldOptions = {},
): PropertyDecorator {
  return applyDecorators(
    IsUndefinable(),
    DateField({ ...options, required: false }),
  );
}
