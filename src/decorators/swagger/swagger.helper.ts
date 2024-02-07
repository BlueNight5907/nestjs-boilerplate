/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/ban-types */
import {
  type ParamData,
  type RouteParamMetadata,
  type Type,
} from '@nestjs/common';
import {
  PARAMTYPES_METADATA,
  ROUTE_ARGS_METADATA,
} from '@nestjs/common/constants';
import { RouteParamtypes } from '@nestjs/common/enums/route-paramtypes.enum';
import { reverseObjectKeys } from '@nestjs/swagger/dist/utils/reverse-object-keys.util';
import _ from 'lodash';

export function explore<T>(
  instance: Object,
  propertyKey: string | symbol,
): T | undefined {
  const types: Array<Type<any>> = Reflect.getMetadata(
    PARAMTYPES_METADATA,
    instance,
    propertyKey,
  );

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const routeArgsMetadata: RouteParamMetadata =
    Reflect.getMetadata(
      ROUTE_ARGS_METADATA,
      instance.constructor,
      propertyKey,
    ) ?? {};

  const parametersWithType = _.mapValues<
    Record<string, { index: number; data: ParamData }>,
    {
      type: any;
      name: ParamData;
      required: boolean;
    }
  >(
    reverseObjectKeys(routeArgsMetadata),
    (param: { index: number; data: ParamData }) => ({
      type: types[param.index],
      name: param.data,
      required: true,
    }),
  );

  for (const [key, value] of Object.entries(parametersWithType)) {
    const keyPair = key.split(':') as unknown as RouteParamtypes[];

    if (
      (Number(keyPair[0]) as unknown as RouteParamtypes) ===
      RouteParamtypes.BODY
    ) {
      return value.type as T;
    }
  }
}
