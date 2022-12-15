import { getFormatDateTime } from '../../../utils/DateUtils';
import { Express, Router } from 'express';
import 'reflect-metadata';

import {
  CONTROLLER_METADATA,
  ROUTE_METADATA,
  PARAM_METADATA,
  PARSE_METADATA,
} from './ControllerMethodDecorator';
import { RouteType, handlerFactory } from './utils';
import { log } from '../../../utils/CommonUtils';

function register(
  controllerStore: Map<string, any>,
  rootPath: string,
  app: Express,
) {
  const router = Router();

  controllerStore.forEach((instance: any, key: string, map: Map<string, any>) => {
    let time = getFormatDateTime()
    // 获取Controller注解的入参--路径
    const controllerRootPath: string = Reflect.getMetadata(
      CONTROLLER_METADATA,
      instance.constructor,
    );
    log(`[register]-controller: ${key} ${controllerRootPath}`)
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
      log(`[register]-load ${type.toUpperCase()}:${path}`)
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

export { register };