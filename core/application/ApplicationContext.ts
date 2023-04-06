import 'reflect-metadata'
import express from 'express'
import fs from 'fs';
import path from 'path'

import { AspectManager } from '../aop/AspectManager';
import { log } from '../utils/CommonUtils';
import { ControllerManager } from 'core/web/ControllerManager';
import { ComponentManager } from 'core/component/ComponentManager';
import { WebsocketManager } from 'core/ws/WebsocketManager';
import { ApplicationInterface } from 'core/Interface';
import { ConfigManager } from 'core/component/config/ConfigManager';


class Application implements ApplicationInterface {
    app?: express.Express; // Express 实例
    appPort?: number = 8080;
    scanPath: string[] = ['']
    startTime: Date = new Date()
    finishStartTime: Date
    isEnableAspect = false
    aspectManager: AspectManager = new AspectManager()
    controllerManager: ControllerManager = new ControllerManager()
    componentManager: ComponentManager = new ComponentManager()
    WebsocketManager: WebsocketManager = new WebsocketManager()
    configManager: ConfigManager = new ConfigManager()

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

    public start(): express.Express {
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

    public applicationStart(p?: { port?: number, scanPath?: string[] }) {

        log(`========================= start Application========================`)
        log(`========================= read Application config =================`)
        this.configManager.init()
        this.appPort = this.configManager.config.service.port
        if (p) {
            if (p.port) {
                application.appPort = p.port
            }
            if (p.scanPath && p.scanPath.length > 0) {
                application.scanPath = p.scanPath
            }
        }
        // 实例化一个Expres
        const app: express.Express = express()
        this.app = app

        // 1.扫描路径
        this.scanBean().then(() => {
            this.configManager.loadConfig(this.componentManager.componentsOnKey);
            // 2.添加wsController
            this.componentManager.addInjectToComponent()
            this.aspectManager.enableAspect(this.isEnableAspect, this.componentManager.componentsOnName);
            this.WebsocketManager.LoadWsController(this.app);
            // 3.添加前置组件(中间件)
            this.componentManager.loadPreComponents(this.app);
            // ->添加普通组件
            // 4.添加 Controller
            this.controllerManager.LoadController(this.app);
            // 5.启动端口
            this.start();
        })
    }
}

log('========================= new Application==========================')
export const application = new Application()