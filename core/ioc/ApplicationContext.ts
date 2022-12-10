import { Express } from 'express'
import { getFormatDateTime } from '../utils/DateUtils'
import fs from 'fs';
import path from 'path'
import { register } from '../decorator/Component/web/register';
import { registerWs } from '../decorator/Component/WsComponent';
import { AspectManager } from '../aop/AspectManager';

interface ApplicationInterface {
    app?: Express // Express 实例
    appPort?: number// = 8080
    preComponents?: Map<string, any> //= new Map(); // 添加Controller之前需要添加的组件集合
    wsControllers?: Map<string, any> //= new Map();  // ws的controller 结合
    controllers?: Map<string, any> //= new Map();    // controller 结合
    components?: Map<string, any> //= new Map();    // 普通组件集合
    scanPath: string[]
    startTime: Date //= new Date()
    finishStartTime: Date
    isEnableAspect: boolean
    aspectManager: AspectManager

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
    preComponents?: Map<string, any> = new Map(); // 添加Controller之前需要添加的组件集合
    wsControllers?: Map<string, any> = new Map();  // ws的controller 结合
    controllers?: Map<string, any> = new Map();    // controller 结合
    components?: Map<string, any> = new Map();    // 普通组件集合
    scanPath: string[] = ['']
    startTime: Date = new Date()
    finishStartTime: Date
    isEnableAspect = false
    aspectManager: AspectManager = new AspectManager()
    constructor() {
        // console.log(`init Application`)
    }


    public addComponents(componentName, component: any) {
        this.components.set(componentName, component)
    }

    getComponent = (componentName): any => {
        let component = this.components.get(componentName)
        return component
    }

    public addPreComponents(name, con: any) {
        this.preComponents.set(name, con)
    }
    public addWsControllers(name: string, con: any) {
        this.wsControllers.set(name, con)
    }
    public addControllers(name: string, con: any) {
        this.controllers.set(name, con)
    }
    public async scanBean() {
        console.log(`========================= scan allComponent========================`)
        // 项目路口
        let rootPath = process.cwd()
        await Promise.all(this.scanPath.map(async p => {
            await this.readDir((rootPath + "/" + p).replace('//', '/'), rootPath);
        })).then(result => {
            // console.log('scan finish')
        }).catch(err => {

        })
        return true;
    }
    public async readDir(dirPath: string, _rootPath: string) {
        try {
            // console.log(dirPath)
            let b = fs.existsSync(dirPath)
            if (!b) return
            let files = fs.readdirSync(dirPath)
            for (let i in files) {
                let fileName = files[i]
                // console.log(fileName)
                let _path = path.join(dirPath, fileName)
                try {
                    let stat = fs.statSync(_path);
                    if (stat.isFile()) {
                        if (fileName == 'app.js' || fileName == 'app.ts' || fileName == 'ioc.ts' || fileName.indexOf('.') == 0) {
                            // 忽略文件
                        } else if (/\.(js|ts)$/.test(fileName)) {
                            // this.requireComponent(`@${_path.replace(_rootPath, '')}`, fileName)
                            // this.requireComponent(`${_path}`, fileName)
                            // console.log(`========> import ${_path}`)
                            await import(_path)
                        }
                    } else if (/(\.git|ui|dist|core|node_modules)/.test(fileName)) {

                    } else if (stat.isDirectory()) {
                        // console.log("isDirectory")
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
        // console.log(`========> import ${filePath}`)
        // require(filePath)
    }

    public start(): Express {
        let port = this.appPort
        this.app.listen(port, () => {
            console.log(`[${getFormatDateTime()}][info][app]:`, `service app listening at \nhttp://0.0.0.0:${port}\nhttp://127.0.0.1:${port}\nhttp://localhost:${port}`)
        })
        this.finishStartTime = new Date()
        console.log(`========================= finish start ============================`)
        return this.app
    }

    public LoadController(): void {
        console.log(`========================= Load Controller =========================`)
        register(this.controllers, '/', this.app);
    }

    public LoadWsController(): void {
        console.log(`========================= Load WsController=========================`)
        registerWs(this.app)
    }
    public loadPreComponents(): void {
        console.log(`========================= load preComponent=========================`)
        let array = []
        for (let [key, value] of this.preComponents.entries()) {
            // console.log(key)
            array.push(value)
        }
        // 从小到大的排序 
        array.sort((Acomponent, Bcomponent) => {
            return Acomponent.index - Bcomponent.index;
        });
        //
        array.forEach(component => {
            console.log(`[${getFormatDateTime()}][info][preComponent]-`, "load preComponent:", component.name)
            if (component && component.enable) {
                component.enable(this.app)
            }
        })
    }

    public enableAspect() {
        if (this.isEnableAspect) {
            console.log('========================= register Aspect==========================')
            // 注册各个切点方法
            this.aspectManager.registerAspect()
            // 实例属性
            let arr = [this.preComponents, this.components, this.wsControllers, this.controllers]
            arr.forEach(components => {
                components.forEach((instance: any, key: string, map: Map<string, any>) => {
                    console.log(key)
                    // instance.isProxy = true
                    const proto = Object.getPrototypeOf(instance);
                    // 方法数组
                    const methodNameArr = Object.getOwnPropertyNames(proto).filter(
                        n => n !== 'constructor' && typeof proto[n] === 'function',
                    );
                    methodNameArr.forEach(methodName => {
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
                    })
                })
            })

        }
    }
}

console.log('========================= new Application==========================')
export const application = new Application()