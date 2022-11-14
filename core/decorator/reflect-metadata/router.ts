import {NextFunction, Request, Response, Router} from 'express';
import { controllerList, paramList, ParamType, parseList, ParseType, routeList } from './decorator';
const router: Router = Router()

function handlerFactory(func: (...args: any[]) => any, paramList: ParamType[], parseList: ParseType[]) {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        // 获取路由函数的参数
        const args = extractParameters(req, res, next, paramList, parseList);
        const result = await func(...args);
        res.send(result);
      } catch (err) {
        next(err);
      }
    };
  }

  function extractParameters(
    req: Request,
    res: Response,
    next: any,
    paramArr: ParamType[] = [],
    parseArr: ParseType[] = [],
  ) {
    if (!paramArr.length) return [req, res, next];
  
    const args = [];
    // 进行第三层遍历
    paramArr.forEach(param => {
      const { key, index, type } = param;
      // 获取相应的值，如 @Query('id') 则为 req.query.id
      switch (type) {
        case 'query':
          args[index] = key ? req.query[key] : req.query;
          break;
        case 'body':
          args[index] = key ? req.body[key] : req.body;
          break;
        case 'headers':
          args[index] = key ? req.headers[key.toLowerCase()] : req.headers;
          break;
        // ...
      }
    });
  
    // 小优化，处理参数类型
    parseArr.forEach(parse => {
      const { type, index } = parse;
      switch (type) {
        case 'number':
          args[index] = +args[index];
          break;
        case 'string':
          args[index] = args[index] + '';
          break;
        case 'boolean':
          args[index] = Boolean(args[index]);
          break;
      }
    });
  
    args.push(req, res, next);
    return args;
  }
  

controllerList.forEach(controller => {
    const { path: basePath, target: cTarget } = controller;
  
    routeList
      // 取出当前根路由下的 route
      .filter(({ target }) => target === cTarget.prototype)
      .forEach(route => {
        const { name: funcName, type, path, func } = route;
        // handler 即我们常见的 (res, req, next) => {}
        const handler = handlerFactory(
            func,
            // 取当前路由函数下装饰的参数列表
            paramList.filter(param => param.name === funcName),
            parseList.filter(parse => parse.name === funcName),
          );
        // 配置 express router
        router[type](basePath + path, handler);
      });
  });

  export default router