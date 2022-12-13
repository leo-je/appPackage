import { application } from "../../ioc/ApplicationContext";
import { getFormatDateTime } from "../../utils/DateUtils";

export const preComponent = (index: number = 100): ClassDecorator => {
    return (targetClass: any) => {
        targetClass.prototype.index = index
        targetClass.prototype.name = targetClass.name
        Reflect.defineMetadata('preComponent', targetClass.name, targetClass);
        console.log(`[${getFormatDateTime()}][info][preComponent]-`, "add preComponent:", targetClass.name)
        const instance = new targetClass();
        application.addPreComponents(targetClass.name, instance)
        application.addBean(targetClass.name, targetClass, instance)
    };
}