import { ComponentInfo, WsRouteType } from "../Interface";
import { log } from "../utils/CommonUtils";
import expressWS from 'express-ws';
import { WsService_METADATA } from "./WsService";

export class WebsocketManager {
    wsControllers?: Map<string, ComponentInfo> = new Map();    // controller 结合



    public async addWsControllers(name: string, con: any) {
        this.wsControllers.set(name, con)
    }

    public LoadWsController(app): void {
        log(`========================= Load WsController========================`)
        this.registerWs(app)
    }

    public registerWs(
        app: any,
    ) {
        let wsApp = expressWS(app).app;
        let wsArr = []
        this.wsControllers.forEach((instance: any, key: string, map: Map<string, any>) => {
            // 获取Controller注解的入参--路径

            const controllerRootPath: string = Reflect.getMetadata(
                WsService_METADATA,
                instance.constructor,
            );
            log(`[registerWs]-WsService: ${controllerRootPath}`)
            // 实例属性
            const proto = Object.getPrototypeOf(instance);
            // 方法数组
            const functionNameArr = Object.getOwnPropertyNames(proto).filter(
                n => n !== 'constructor' && typeof proto[n] === 'function',
            );
            functionNameArr.forEach(functionName => {
                const routeMetadata: WsRouteType = Reflect.getMetadata(
                    'info',
                    proto[functionName],
                );
                if (!routeMetadata) return;
                const { type, path } = routeMetadata;
                log(`[registerWs]-load ${type.toUpperCase()}:${path}`)

                wsArr[wsArr.length] = {
                    path: controllerRootPath + path, handler: this.createWsHandler(instance,
                        functionName)
                };
            });
        });
        for (let i = 0; i < wsArr.length; i++) {
            let ws = wsArr[i];
            wsApp.ws(ws.path, ws.handler)
        }


    }

    createWsHandler(instance,
        functionName,): any {
        return async (ws, req, next) => {
            try {
                await instance[functionName](ws, req, next)
            } catch (e) {
                console.error(e)
            }

        }
    }
}