import { NumberFieldOptional } from 'decorators/field';
import { type IPageOptions } from 'definitions/interfaces';

export class PageOptionsDto implements IPageOptions {
  @NumberFieldOptional({
    min: 1,
    default: 1,
    int: true,
  })
  readonly page: number = 1;

  @NumberFieldOptional({
    min: 1,
    max: 50,
    default: 10,
    int: true,
  })
  readonly take: number = 10;

  get skip(): number {
    return (this.page - 1) * this.take;
  }
}
