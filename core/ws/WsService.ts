import { application } from '../application/ApplicationContext';

import { getTargetId, log } from '../utils/CommonUtils';

export const WsService_METADATA = 'WsService';
export const WsService = (path: string = '', componentName?: string): ClassDecorator => {
    return (constructor: any) => {
        let id = getTargetId(constructor)
        if (!componentName) {
            componentName = constructor.name + '_' + id
        }
        Reflect.defineMetadata(WsService_METADATA, path, constructor);
        log(`[WsService]- add WsService: ${constructor.name}`,)
        let instance = new constructor();
        application.WebsocketManager.addWsControllers(componentName, instance)
        application.componentManager.addBean(componentName, constructor, instance)
    };
}




