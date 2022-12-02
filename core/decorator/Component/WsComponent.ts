import { application } from '@/core/ioc/ApplicationContext';
import { getFormatDateTime } from '@/core/utils/DateUtils';
import expressWS from 'express-ws';
import { addBean } from './Component';

const WsService_METADATA = 'WsService';
export const WsService = (path: string = '', name: string = ''): ClassDecorator => {
    return (targetClass: any) => {
        Reflect.defineMetadata(WsService_METADATA, path, targetClass);
        console.log(`[${getFormatDateTime()}][info][WsService]-`, "add WsService:", targetClass.name)
        let instance = new targetClass();
        application.addWsControllers(targetClass.name, instance)
        addBean(name, targetClass, instance)
    };
}

export const EndPoint = (path = '/'): MethodDecorator => {
    return (target: object, name: string, descriptor: any) => {
        // target：当前类实例，name：当前函数名，descriptor：当前属性（函数）的描述符
        Reflect.defineMetadata(
            'info',
            { type: 'ws', path },
            descriptor.value,
        );
    }
}

interface WsRouteType {
    type: string;
    path: string;
    func: (...args: any[]) => any;
    loaded?: boolean;
}
export function registerWs(
    app: any,
) {
    let wsApp = expressWS(app).app;
    let wsArr = []
    application.wsControllers.forEach((instance: any, key: string, map: Map<string, any>) => {
        let time = getFormatDateTime()
        // 获取Controller注解的入参--路径

        const controllerRootPath: string = Reflect.getMetadata(
            WsService_METADATA,
            instance.constructor,
        );
        console.log(`[${time}][info][registerWs]-WsService:`, controllerRootPath)
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
            console.log(`[${time}][info][registerWs]-load ${type.toUpperCase()}:${path}`)

            wsArr[wsArr.length] = {
                path: controllerRootPath + path, handler: createWsHandler(instance,
                    functionName)
            };
        });
    });
    for (let i = 0; i < wsArr.length; i++) {
        let ws = wsArr[i];
        wsApp.ws(ws.path, ws.handler)
    }


}

function createWsHandler(instance,
    functionName,): any {
    return async (ws, req, next) => {
        try {
            await instance[functionName](ws, req, next)
        } catch (e) {
            console.error(e)
        }

    }
}