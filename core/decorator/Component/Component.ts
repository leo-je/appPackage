import { application } from "@/core/ioc/ApplicationContext";
import { getFormatDateTime } from "@/core/utils/DateUtils";

// export const autoWiringComponents = []
// export const WsServiceComponents = []


const Component = (componentName?: string): ClassDecorator => {
    return (originClass: any) => {
        addBean(componentName, originClass, new originClass())
    };
};

const addBean = (componentName: string, originClass: any, instance: any) => {
    var _componentName;
    componentName = ((_componentName = componentName) !== null && _componentName !== void 0 ? _componentName : originClass.name);
    let component = {
        status: 'wired',
        value: originClass,
        instance: instance,
    };
    //autoWiringComponents[originClass] = autoWiringComponents[componentName]
    application.addComponents(componentName, component)
    console.log(`[${getFormatDateTime()}][info][Component]-load component:${componentName}`, originClass.name)
}

export function Inject(_constructor: any, propertyName: string): any {
    // 元数据反射 获取当前装饰的元素的类型
    // console.log(autoWiringComponents)
    // const propertyType: any = Reflect.getMetadata('design:type', _constructor, propertyName)
    // let providerInsntanceClass = autoWiringComponents[propertyName].value;
    // let providerInsntance = autoWiringComponents[propertyName].instance
    // if (!providerInsntance) {
    //     console.log(`[${__filename}]-Inject: new a ${propertyName}`)
    //     providerInsntance = new providerInsntanceClass()
    //     autoWiringComponents[propertyName].instance = providerInsntance
    //     autoWiringComponents[providerInsntanceClass] = autoWiringComponents[propertyName]
    // }
    // _constructor[propertyName] = providerInsntance
    // return (_constructor as any)[propertyName];
}

const AutoWired = (componentName?: string) => {
    return (originClass, propertyKey?) => {
        getComponentInstance(componentName !== null && componentName !== void 0 ? componentName : propertyKey).then(component => {
            originClass[propertyKey] = component;
        });
    };
};

const getComponentInstance = async (componentName) => {
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
        }
        if (autoWiringComponent.status === 'wired') {
            return application.getComponent(componentName);
        } else {
            throw new Error('Unknown Wiring status');
        }
    };
    const ComponentClass = (await getComponent(componentName)).value;
    let providerInsntance = (await getComponent(componentName)).instance;
    if (!providerInsntance) {
        console.log(`[${__filename}]-AutoWired: new a ${componentName}`)
        providerInsntance = new ComponentClass()
        application.getComponent(componentName).instance = providerInsntance
    }
    return providerInsntance;
}

export {
    Component, AutoWired, getComponentInstance, addBean
}