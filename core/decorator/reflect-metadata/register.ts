import { getFormatDateTime } from '@/core/utils/DateUtils';
import { Express, Router } from 'express';
import 'reflect-metadata';

import {
  CONTROLLER_METADATA,
  ROUTE_METADATA,
  PARAM_METADATA,
  PARSE_METADATA,
} from './decorator';
import { RouteType, handlerFactory } from './utils';

function register(
  controllerStore: Record<string, any>,
  rootPath: string,
  app: Express,
) {
  const router = Router();

  Object.values(controllerStore).forEach(instance => {
    let time = getFormatDateTime()
    // 获取Controller注解的入参--路径
    const controllerRootPath: string = Reflect.getMetadata(
      CONTROLLER_METADATA,
      instance.constructor,
    );
    console.log(`[${time}][info][register]-controller:`, instance, controllerRootPath)
    // 实例属性
    const proto = Object.getPrototypeOf(instance);
    // 方法数组
    const functionNameArr = Object.getOwnPropertyNames(proto).filter(
      n => n !== 'constructor' && typeof proto[n] === 'function',
    );
    functionNameArr.forEach(functionName => {
      const routeMetadata: RouteType = Reflect.getMetadata(
        ROUTE_METADATA,
        proto[functionName],
      );
      if (!routeMetadata) return;
      const { type, path } = routeMetadata;
      console.log(`[${time}][info][register]-load ${type.toUpperCase()}:${path}`)
      const handler = handlerFactory(
        instance,
        functionName,
        Reflect.getMetadata(PARAM_METADATA, instance, functionName),
        Reflect.getMetadata(PARSE_METADATA, instance, functionName),
      );
      router[type](controllerRootPath + path, handler);
    });
  });

  app.use(rootPath, router);
}

export {register} ;