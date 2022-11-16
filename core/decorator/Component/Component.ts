export const autoWiringComponents = []

const Component = (componentName): ClassDecorator => {
    return originClass => {
        var _componentName;
        componentName = ((_componentName = componentName) !== null && _componentName !== void 0 ? _componentName : originClass.name);
        autoWiringComponents[componentName] = {
            status: 'wiring'
        };
        autoWiringComponents[componentName].value = originClass;
        autoWiringComponents[componentName].status = 'wired';
        autoWiringComponents[componentName].instance = null;
        console.log("注册Component-", _componentName)

    };
};

export function Inject(_constructor: any, propertyName: string): any {
    // 元数据反射 获取当前装饰的元素的类型
    // console.log(autoWiringComponents)
    const propertyType: any = Reflect.getMetadata('design:type', _constructor, propertyName)
    let providerInsntanceClass = autoWiringComponents[propertyName].value;
    let providerInsntance = autoWiringComponents[propertyName].instance
    if (!providerInsntance) {
        console.log(`[${__filename}]-Inject: new a ${propertyName}`)
        providerInsntance = new providerInsntanceClass()
        autoWiringComponents[propertyName].instance = providerInsntance
    }
    _constructor[propertyName] = providerInsntance
    return (_constructor as any)[propertyName];
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
        const autoWiringComponent = autoWiringComponents[componentName];
        if (autoWiringComponent === undefined || autoWiringComponent.status === 'wiring') {
            return new Promise((resolve, reject) => {
                setTimeout(_ => {
                    if (waitTimes === 0) {
                        reject(new Error('Component not found'));
                        return;
                    }
                    waitTimes -= 1;
                    getComponent(componentName).then(resolve).catch(reject);
                }, 500);
            });
        }
        if (autoWiringComponent.status === 'wired') {
            return autoWiringComponents[componentName];
        } else {
            throw new Error('Unknown Wiring status');
        }
    };
    const ComponentClass = (await getComponent(componentName)).value;
    let providerInsntance = (await getComponent(componentName)).instance;
    if (!providerInsntance) {
        console.log(`[${__filename}]-AutoWired: new a ${componentName}`)
        providerInsntance = new ComponentClass()
        autoWiringComponents[componentName].instance = providerInsntance
    }
    return providerInsntance;
}

export {
    Component, AutoWired
}