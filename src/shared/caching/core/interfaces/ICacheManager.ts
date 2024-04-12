import { type IDeleteAction } from './IDeleteAction';
import { type IGetAction } from './IGetAction';
import { type ISetAction } from './ISetAction';

export interface ICacheManagerOptions {
  prefix?: string;
}

export interface ICacheManager extends IGetAction, ISetAction, IDeleteAction {}
