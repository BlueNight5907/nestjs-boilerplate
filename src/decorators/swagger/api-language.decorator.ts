import { ApiHeader, ApiQuery } from '@nestjs/swagger';
import { LanguageCode } from 'enums';

export function ApiLanguageDecorator(
  options: { from?: 'header' | 'query' } = {},
) {
  if (options.from === 'header') {
    return ApiHeader({
      name: 'x-lang',
      allowEmptyValue: true,
      description: 'API response language',
      enum: LanguageCode,
      required: false,
    });
  }

  return ApiQuery({
    enum: LanguageCode,
    name: 'lang',
    allowEmptyValue: true,
    description: 'API response language',
    required: false,
  });
}
