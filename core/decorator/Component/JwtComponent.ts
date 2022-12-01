import { addBean } from "./Component";


export const enableJwt = (path: string = '', name: string = ''): ClassDecorator => {
    return (targetClass: any) => {
        // Reflect.defineMetadata(WsService_METADATA, path, targetClass);
        // console.log(`[${getFormatDateTime()}][info][WsService]-`, "add WsService:", targetClass.name)
        // let instance = new targetClass();
        // WsServices[targetClass.name] = instance
        // addBean(name, targetClass, instance)
    };
}