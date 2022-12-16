import { getTargetId, log, proxify } from "../utils/CommonUtils";
import { application } from "../application/ApplicationContext";

export const PreComponent = (index: number = 100, componentName?: string): ClassDecorator => {
    return (constructor: any) => {
        let id = getTargetId(constructor)
        if (!componentName) {
            componentName = constructor.name + '_' + id
        }
        constructor.prototype.index = index
        constructor.prototype.name = constructor.name
        Reflect.defineMetadata('preComponent', constructor.name, constructor);
        log(`[PreComponent]- add PreComponent: ${constructor.name}`)
        const instance = proxify(new constructor());
        application.componentManager.addPreComponents(componentName, instance)
        application.componentManager.addBean(componentName, constructor, instance)
    };
}