import { Express } from 'express'
import { getFormatDateTime } from '../utils/DateUtils'
import fs from 'fs';
import path from 'path'
import { register } from '../decorator/reflect-metadata/register';
import { registerWs } from '../decorator/Component/WsComponent';

interface ApplicationInterface {
    addComponents(componentName, component: any): void
    getComponent(componentName): any
    addPreComponents(name: string, con: any)
    addWsControllers(name: string, con: any)
    addControllers(name: string, con: any)
    start(): Express
}

class Application implements ApplicationInterface {
    app?: Express // Express 实例
    appPort?: number = 8080
    preComponents?: Map<string, any> = new Map(); // 添加Controller之前需要添加的组件集合
    wsControllers?: Map<string, any> = new Map();  // ws的controller 结合
    controllers?: Map<string, any> = new Map();    // controller 结合
    components?: Map<string, any> = new Map();    // 普通组件集合

    scanPath: string[]

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
    public scanBean() {
        // 项目路口
        let rootPath = process.cwd()
        for (let i in this.scanPath) {
            this.readDir((rootPath + "/" + this.scanPath[i]).replace('//', '/'), rootPath);
        }
    }
    readDir(dirPath: string, _rootPath: string) {
        try {
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
                            this.requireComponent(`@${_path.replace(_rootPath, '')}`, fileName)
                            // requireComponent(`@${_path}`, fileName)
                        }
                    } else if (/(\.git|ui|dist|core|node_modules)/.test(fileName)) {

                    } else if (stat.isDirectory()) {
                        // console.log("isDirectory")
                        this.readDir(_path, _rootPath)
                    }
                } catch (e) {
                    console.error(e)
                }
            }
        } catch (err) {
            console.error(err)
        }

    }

    requireComponent(filePath: string, className: string) {
        require(filePath)
    }

    public start(): Express {
        let port = this.appPort
        this.app.listen(port, () => {
            console.log(`[${getFormatDateTime()}][info][app]:`, `service app listening at \nhttp://0.0.0.0:${port}\nhttp://127.0.0.1:${port}\nhttp://localhost:${port}`)
        })
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
}

export const application = new Application()