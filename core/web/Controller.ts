import { application } from "../application/ApplicationContext";
import { getTargetId, log, proxify } from "../utils/CommonUtils";
import { CONTROLLER_METADATA } from "./ControllerMethodDecorator";


export const Controller = (path = ''): ClassDecorator => {
    return (constructor: any) => {
        let id = getTargetId(constructor)
        let componentName = constructor.name + '_' + id
        // log(`\nController.get ${targetClass.name} target.__uuid:${getTargetId(targetClass)} typeOf target ${typeof targetClass}\n`)
        Reflect.defineMetadata(CONTROLLER_METADATA, path, constructor);
        log(`[Controller]-add Controller: ${constructor.name}`)
        let instance = proxify(new constructor())
        // log(`\nController.get ${instance.constructor.name} target.__uuid:${instance.constructor["__uuid"]} \n`)
        application.controllerManager.addControllers(componentName, instance)
        application.componentManager.addBean(componentName, constructor, instance)
    };
}