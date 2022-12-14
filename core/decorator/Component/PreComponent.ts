import { getTargetId } from "@/core/utils/CommonUtils";
import { application } from "../../ioc/ApplicationContext";
import { getFormatDateTime } from "../../utils/DateUtils";

export const preComponent = (index: number = 100, componentName?: string): ClassDecorator => {
    return (targetClass: any) => {
        getTargetId(targetClass)
        targetClass.prototype.index = index
        targetClass.prototype.name = targetClass.name
        Reflect.defineMetadata('preComponent', targetClass.name, targetClass);
        console.log(`[${getFormatDateTime()}][info][preComponent]-`, "add preComponent:", targetClass.name)
        const instance = new targetClass();
        application.addPreComponents(componentName || targetClass.name, instance)
        application.addBean(componentName || targetClass.name, targetClass, instance)
    };
}