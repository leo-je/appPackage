import { application } from "../../../ioc/ApplicationContext";
import { getTargetId, log } from "../../../utils/CommonUtils";
import { getFormatDateTime } from "../../../utils/DateUtils";
import { CONTROLLER_METADATA } from "./ControllerMethodDecorator";


export const Controller = (path = ''): ClassDecorator => {
    return (constructor: any) => {
        getTargetId(constructor)
        // log(`\nController.get ${targetClass.name} target.__uuid:${getTargetId(targetClass)} typeOf target ${typeof targetClass}\n`)
        Reflect.defineMetadata(CONTROLLER_METADATA, path, constructor);
        log(`[Controller]-add Controller: ${constructor.name}`)
        let instance = new constructor()
        // log(`\nController.get ${instance.constructor.name} target.__uuid:${instance.constructor["__uuid"]} \n`)
        application.addControllers(constructor.name, instance)
        application.addBean(constructor.name, constructor, instance)
    };
}