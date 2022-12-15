import { getTargetId, log, proxify } from "../../utils/CommonUtils";
import { application } from "../../ioc/ApplicationContext";

// export const autoWiringComponents = []
// export const WsServiceComponents = []

/**
 * 
 * @param componentName 组件名称 如果不传,默认使用类名作为名称key
 * @returns 
 */
const Component = (componentName?: string): ClassDecorator => {
    return (constructor: any) => {
        getTargetId(constructor)
        application.addBean(componentName, constructor, proxify(new constructor()))
    };
};

export function Inject(_constructor: any, propertyName: string): any {
    // 元数据反射 获取当前装饰的元素的类型
    // log(autoWiringComponents)
    // const propertyType: any = Reflect.getMetadata('design:type', _constructor, propertyName)
    // let providerInsntanceClass = autoWiringComponents[propertyName].value;
    // let providerInsntance = autoWiringComponents[propertyName].instance
    // if (!providerInsntance) {
    //     log(`[${__filename}]-Inject: new a ${propertyName}`)
    //     providerInsntance = new providerInsntanceClass()
    //     autoWiringComponents[propertyName].instance = providerInsntance
    //     autoWiringComponents[providerInsntanceClass] = autoWiringComponents[propertyName]
    // }
    // _constructor[propertyName] = providerInsntance
    // return (_constructor as any)[propertyName];
}

/**
 * 
 * @param componentKey 依赖名称或者类
 * @returns 
 */
const AutoWired = <T>(componentKey?: string | any): PropertyDecorator => {
    /**
     * @param target 属性所属类的prototype
     * @param propertyKey 属性名称
     */
    return (target: Object, propertyKey: string) => {
        // if (!target.constructor["__uuid"]) {
        //     let id = randomUUID()
        //     target.constructor["__uuid"] = id
        //     log(`\nAutoWired.set ${target.constructor.name} target.__uuid:${target.constructor["__uuid"]} typeOf target ${typeof target} ${typeof target.constructor}\n`)
        // } else {
        //     log(`\nAutoWired.get ${target.constructor.name} target.__uuid:${target.constructor["__uuid"]}\n`)
        // }
        // log(`\nAutoWired. type of propertyKey ${typeof target.constructor[propertyKey]}\n`)
        let targetId = getTargetId(target)
        const inject = {
            targetId,
            target,
            targetClassName: target.constructor.name,
            propertyKey,
            componentKey,
        }
        // log(`\n${inject.targetClassName} need ${inject.componentKey} --- \n${typeof componentKey}\n`)

        // if (componentKey && typeof componentKey != 'string') {
        //     getComponentInstanceByClazz(componentKey).then(component => {
        //         target[propertyKey] = component;
        //     }).catch(e => { });
        // } else {
        //     getComponentInstanceByName(componentKey !== null && componentKey !== void 0 ? componentKey : propertyKey).then(component => {
        //         target[propertyKey] = component;
        //     }).catch(e => { });
        // }

        let map = application.injectInfos.get(targetId)
        if (!map) {
            map = []
        }
        map.push(inject)
        application.injectInfos.set(targetId, map)
    };
};


const getComponentInstanceByClazz = async (componentKey) => {
    let waitTimes = 10;
    const getComponent = async componentKey => {
        const autoWiringComponent = application.getComponentByClazz(componentKey);
        if (autoWiringComponent === undefined || autoWiringComponent.status === 'wiring') {
            return new Promise((resolve, reject) => {
                setTimeout(_ => {
                    if (waitTimes === 0) {
                        reject(new Error(`component ${componentKey} not found`));
                        return;
                    }
                    waitTimes -= 1;
                    getComponent(componentKey).then(resolve).catch(reject);
                }, 500);
            });
        } else {
            return autoWiringComponent
        }

    };
    const ComponentClass = (await getComponent(componentKey)).value;
    let providerInsntance = (await getComponent(componentKey)).instance;
    if (!providerInsntance) {
        log(`[${__filename}]-AutoWired: new a ${componentKey}`)
        providerInsntance = new ComponentClass()
        application.addBean(componentKey, ComponentClass, providerInsntance)
    }
    return providerInsntance;
}

const getComponentInstanceByName = async (componentName) => {
    let waitTimes = 10;
    const getComponent = async componentName => {
        const autoWiringComponent = application.getComponent(componentName);
        if (autoWiringComponent === undefined || autoWiringComponent.status === 'wiring') {
            return new Promise((resolve, reject) => {
                setTimeout(_ => {
                    if (waitTimes === 0) {
                        reject(new Error(`component ${componentName} not found`));
                        return;
                    }
                    waitTimes -= 1;
                    getComponent(componentName).then(resolve).catch(reject);
                }, 500);
            });
        } else {
            return autoWiringComponent
        }
    };
    const ComponentClass = (await getComponent(componentName)).value;
    let providerInsntance = (await getComponent(componentName)).instance;
    if (!providerInsntance) {
        log(`[${__filename}]-AutoWired: new a ${componentName}`)
        providerInsntance = new ComponentClass()
        application.addBean(componentName, ComponentClass, providerInsntance)
    }
    return providerInsntance;
}

export {
    Component, AutoWired, getComponentInstanceByName
}