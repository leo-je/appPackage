import { application } from "../../application/ApplicationContext"
import { getTargetId } from "../../utils/CommonUtils"

export interface ConfigInfo {
    targetId: string,
    target: object,
    targetClassName: string,
    configFilePath: string,
}


export interface ValueInfo {
    targetId: string,
    target: any
    propertyKey: string,
    property: string,
    defaultValue: string,
    keyPath: string,
    valueType: "string" | "number" | "boolean" | "object" 
}

export const Config = (configFilePath: string): ClassDecorator => {
    /**
     * @param target 属性所属类的prototype
     * @param propertyKey 属性名称
     */
    return (constructor: any) => {
        let targetId = getTargetId(constructor)
        let configInfo: ConfigInfo = {
            targetId,
            target: constructor,
            targetClassName: constructor.name,
            configFilePath
        }

        application.configManager.addConfig(configInfo)
    }
}

/**
 * 
 * @param property 属性路径:默认值
 * @param valueType 属性类型,默认string
 * @returns 
 */
export const Value = (property: string,valueType:"string" | "number" | "boolean" | "object" = 'string'): PropertyDecorator => {
    /**
     * @param target 属性所属类的prototype
     * @param propertyKey 属性名称
     */
    return (target: Object, propertyKey: string) => {
        let targetId = getTargetId(target)
        let s = property.split(':')
        let defaultValue = s.length == 2 ? s[1] : null
        let valueInfo: ValueInfo = {
            targetId,
            target,
            propertyKey,
            property,
            defaultValue,
            keyPath: s[0],
            valueType
        }
        application.configManager.addValueConfig(valueInfo)
    }
}