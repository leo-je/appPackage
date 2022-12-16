import { ComponentInfo, InjectInfo } from "core/Interface";
import { log } from "core/utils/CommonUtils";


export class ComponentManager {
    preComponents?: Map<string, ComponentInfo> = new Map(); // 添加Controller之前需要添加的组件集合
    componentsOnName?: Map<string, ComponentInfo> = new Map();    // 普通组件集合
    componentsOnKey?: Map<any, ComponentInfo> = new Map();    // 普通组件集合
    injectInfos: Map<string, InjectInfo[]> = new Map();

    public async addComponents(componentName, component: ComponentInfo) {
        if (component.value) {
            this.componentsOnKey.set(component.value, component)
        }
        this.componentsOnName.set(componentName, component)
    }

    public async addPreComponents(name: string, con: any) {
        this.preComponents.set(name, con)
    }

    public loadPreComponents(app): void {
        log(`========================= load preComponent========================`)
        let array = []
        for (let [key, value] of this.preComponents.entries()) {
            // log(key)
            array.push(value)
        }
        // 从小到大的排序 
        array.sort((Acomponent, Bcomponent) => {
            return Acomponent.index - Bcomponent.index;
        });
        //
        array.forEach(component => {
            log(`[preComponent]- load preComponent: ${component.name}`)
            if (component && component.enable) {
                component.enable(app)
            }
        })
    }

    getComponent(componentName): any {
        let component = this.componentsOnName.get(componentName)
        return component
    }

    getComponentByClazz(componentClazz): any {
        let component = this.componentsOnKey.get(componentClazz)
        return component
    }

    /**
    * 
    * @param componentName 组件名称
    * @param originClass 组件class
    * @param instance 组件实例
    */
    public async addBean(componentName: string, originClass: any, instance: any) {
        let _componentName;
        componentName = ((_componentName = componentName) !== null && _componentName !== void 0 ? _componentName : originClass.name);
        let component = {
            className: originClass.name,
            componentName,
            status: 'wired',
            value: originClass,
            instance: instance,
        };
        //autoWiringComponents[originClass] = autoWiringComponents[componentName]
        this.addComponents(componentName, component)
        log(`[Component]-load component:${componentName} ${originClass.name}`)
    }


    public addInjectToComponent() {
        log('========================= add Inject===============================')
        this.componentsOnName.forEach((component: ComponentInfo, _key, _map: Map<string, ComponentInfo>) => {
            let targetId = component.value["__uuid"]

            let ins: InjectInfo[] = this.injectInfos.get(targetId)
            if (!ins) return
            ins.forEach((injectInfo: InjectInfo) => {
                this.setInject(component, injectInfo)
            })
        })
    }

    public async setInject(component: ComponentInfo, injectInfo: InjectInfo) {
        let type = 'name'
        let injectComponent: ComponentInfo = null
        if (injectInfo.componentKey && typeof injectInfo.componentKey != 'string') {
            type = 'class'
            // log(`${injectInfo.componentKey['__uuid']}`)
            // log(`${injectInfo.componentKey.prototype.constructor['__uuid']}`)
            injectComponent = this.componentsOnKey.get(injectInfo.componentKey)
        } else {
            let injectComponentName = injectInfo.componentKey || injectInfo.propertyKey
            injectComponent = this.componentsOnName.get(injectComponentName)
        }
        if (injectComponent) {
            log(`[addInjectToComponent][name]: ${component.componentName} [inject]: <${type}> ${injectInfo.propertyKey}`)
            component.instance[injectInfo.propertyKey] = injectComponent.instance
        } else {
            log(`[addInjectToComponent] fail add inject to ${injectInfo.targetClassName} : ${injectInfo.propertyKey}`)
        }
    }
}