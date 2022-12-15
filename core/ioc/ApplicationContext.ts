import { Express } from 'express'
import { getFormatDateTime } from '../utils/DateUtils'
import fs from 'fs';
import path from 'path'
import { register } from '../decorator/Component/web/register';
import { registerWs } from '../decorator/Component/WsComponent';
import { AspectManager } from '../aop/AspectManager';
import { log } from '../utils/CommonUtils';


interface InjectInfo {
    targetId: string
    target: object
    targetClassName: string,
    componentKey?: string | any
    propertyKey: string
}

interface ComponentInfo {
    className: string
    componentName: string
    status: string
    value: any
    instance: any,
}

interface ApplicationInterface {
    app?: Express // Express 实例
    appPort?: number// = 8080
    preComponents?: Map<string, ComponentInfo> //= new Map(); // 添加Controller之前需要添加的组件集合
    wsControllers?: Map<string, ComponentInfo> //= new Map();  // ws的controller 结合
    controllers?: Map<string, ComponentInfo> //= new Map();    // controller 结合
    components?: Map<string, ComponentInfo> //= new Map();    // 普通组件集合
    scanPath: string[]
    startTime: Date //= new Date()
    finishStartTime: Date
    isEnableAspect: boolean
    aspectManager: AspectManager
    injectInfos: Map<string, InjectInfo[]>
    addComponents(componentName, component: any): void
    getComponent(componentName): any
    addPreComponents(name: string, con: any)
    addWsControllers(name: string, con: any)
    addControllers(name: string, con: any)
    start(): Express
}

class Application implements ApplicationInterface {

    app?: Express; // Express 实例
    appPort?: number = 8080;
    preComponents?: Map<string, ComponentInfo> = new Map(); // 添加Controller之前需要添加的组件集合
    wsControllers?: Map<string, ComponentInfo> = new Map();  // ws的controller 结合
    controllers?: Map<string, ComponentInfo> = new Map();    // controller 结合
    components?: Map<string, ComponentInfo> = new Map();    // 普通组件集合
    componentsOnKey?: Map<any, ComponentInfo> = new Map();    // 普通组件集合
    scanPath: string[] = ['']
    startTime: Date = new Date()
    finishStartTime: Date
    isEnableAspect = false
    aspectManager: AspectManager = new AspectManager()
    injectInfos: Map<string, InjectInfo[]> = new Map();
    constructor() {
        // log(`init Application`)
    }

    public async addComponents(componentName, component: ComponentInfo) {
        if (component.value) {
            this.componentsOnKey.set(component.value, component)
        }
        this.components.set(componentName, component)
    }

    getComponent = (componentName): any => {
        let component = this.components.get(componentName)
        return component
    }

    getComponentByClazz = (componentClazz): any => {
        let component = this.componentsOnKey.get(componentClazz)
        return component
    }

    public async addPreComponents(name: string, con: any) {
        this.preComponents.set(name, con)
    }
    public async addWsControllers(name: string, con: any) {
        this.wsControllers.set(name, con)
    }
    public async addControllers(name: string, con: any) {
        this.controllers.set(name, con)
    }
    public async scanBean() {
        log(`========================= scan allComponent========================`)
        // 项目路口
        let rootPath = process.cwd()
        await Promise.all(this.scanPath.map(async p => {
            await this.readDir((rootPath + "/" + p).replace('//', '/'), rootPath);
        })).then(result => {
            // log('scan finish')
        }).catch(err => {

        })
        return true;
    }
    public async readDir(dirPath: string, _rootPath: string) {
        try {
            // log(dirPath)
            let b = fs.existsSync(dirPath)
            if (!b) return
            let files = fs.readdirSync(dirPath)
            for (let i in files) {
                let fileName = files[i]
                // log(fileName)
                let _path = path.join(dirPath, fileName)
                try {
                    let stat = fs.statSync(_path);
                    if (stat.isFile()) {
                        if (fileName == 'app.js' || fileName == 'app.ts' || fileName == 'ioc.ts' || fileName.indexOf('.') == 0) {
                            // 忽略文件
                        } else if (/\.(js|ts|mjs)$/.test(fileName)) {
                            // this.requireComponent(`@${_path.replace(_rootPath, '')}`, fileName)
                            // this.requireComponent(`${_path}`, fileName)
                            // log(`========> import ${_path}`)
                            await import(_path)
                        }
                    } else if (/(\.git|ui|dist|core|node_modules)/.test(fileName)) {

                    } else if (stat.isDirectory()) {
                        // log("isDirectory")
                        await this.readDir(_path, _rootPath)
                    }
                } catch (e) {
                    console.error(e)
                }
            }
        } catch (err) {
            console.error(err)
        }

    }

    public requireComponent(filePath: string, className: string) {
        // log(`========> import ${filePath}`)
        // require(filePath)
    }

    public start(): Express {
        let port = this.appPort
        this.app.listen(port, () => {
            log(`[Application] Application listening at: `)
            log(`[Application] http://0.0.0.0:${port}`)
            log(`[Application] http://127.0.0.1:${port}`)
            log(`[Application] http://localhost:${port}`)
        })
        this.finishStartTime = new Date()
        log(`========================= finish start ============================`)
        return this.app
    }

    public LoadController(): void {
        log(`========================= Load Controller =========================`)
        register(this.controllers, '/', this.app);
    }

    public LoadWsController(): void {
        log(`========================= Load WsController========================`)
        registerWs(this.app)
    }
    public loadPreComponents(): void {
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
                component.enable(this.app)
            }
        })
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

    public enableAspect() {
        if (this.isEnableAspect) {
            log('========================= register Aspect==========================')
            // 注册各个切点方法
            this.aspectManager.registerAspect()
            // 实例属性
            this.components.forEach((component: ComponentInfo, _key: string, _map: Map<string, any>) => {
                this.proxyMethod(component)
            })
        }
    }

    private async proxyMethod(component: ComponentInfo) {
        // log(key)
        // instance.isProxy = true
        const instance = component.instance
        const proto = Object.getPrototypeOf(instance);
        // 方法数组
        const methodNameArr = Object.getOwnPropertyNames(proto).filter(
            n => n !== 'constructor' && typeof proto[n] === 'function',
        );
        const proxy = async (methodName) => {
            const strArray = ['toString', 'valueOf', '__defineGetter__', '__defineSetter__',
                'hasOwnProperty', '__lookupSetter__',
                '__lookupGetter__', 'isPrototypeOf',
                '__lookupSetter__ ', 'propertyIsEnumerable', 'toLocaleString'];
            const hasString = strArray.includes(methodName);
            if (hasString) return;
            const invokeMethod = this.aspectManager.invoke(instance, methodName)
            if (invokeMethod) {
                instance[methodName] = invokeMethod
            }
        }
        methodNameArr.forEach(methodName => {
            proxy(methodName)
        })
    }

    public addInjectToComponent() {
        log('========================= add Inject===============================')
        this.components.forEach((component: ComponentInfo, _key, _map: Map<string, ComponentInfo>) => {
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
            injectComponent = this.components.get(injectComponentName)
        }
        if (injectComponent) {
            log(`[addInjectToComponent][name]: ${component.componentName} [inject]: <${type}> ${injectInfo.propertyKey}`)
            component.instance[injectInfo.propertyKey] = injectComponent.instance
        } else {
            log(`[addInjectToComponent] fail add inject to ${injectInfo.targetClassName} : ${injectInfo.propertyKey}`)
        }
    }
}

log('========================= new Application==========================')
export const application = new Application()