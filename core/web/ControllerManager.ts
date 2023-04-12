import { log } from "../utils/CommonUtils";
import express from 'express'
import { CONTROLLER_METADATA, ROUTE_METADATA, PARAM_METADATA, PARSE_METADATA } from "./ControllerMethodDecorator";
import { handlerFactory, RouteType } from "./utils";


export class ControllerManager {

    /**
     * key:className_id
     * value:controllerInstance
     */
    controllers?: Map<string, any> = new Map();  // controller 结合
    router: express.Router


    public async addControllers(name: string, con: any) {
        this.controllers.set(name, con)
    }

    public LoadController(app): void {
        log(`========================= Load Controller =========================`)
        this.register('/', app);
    }

    public register(
        rootPath: string,
        app: express.Express,
    ) {
        const router = express.Router();
        this.router = router
        this.controllers.forEach((instance, key: string, map: Map<string, any>) => {
            // 获取Controller注解的入参--路径
            const controllerRootPath: string = Reflect.getMetadata(
                CONTROLLER_METADATA,
                instance.constructor,
            );
            log(`[register]-|controller: ${instance.constructor.name} ${controllerRootPath}`)
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
                log(`[register] |--- type:${type.toUpperCase()} path:${path} `)
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

}