import { application } from "../ioc/ApplicationContext"
import { Express } from 'express'
import express from 'express'

export const EnableApplication = (p?: { port?: number, scanPath?: string[] }): ClassDecorator => {
    return (targetClass: any) => {
        if (p) {
            if (p.port) {
                application.appPort = p.port
            }
            if (p.scanPath && p.scanPath.length > 0) {
                application.scanPath = p.scanPath
            } 
        }
        console.log(`========================= start Application========================`)
        // 实例化一个Expres
        const app: Express = express()
        application.app = app

        // 1.扫描路径
        application.scanBean().then(() => {
            // 2.添加wsController
            application.enableAspect()
            application.LoadWsController();
            // 3.添加前置组件(中间件)
            application.loadPreComponents();
            // ->添加普通组件
            // 4.添加 Controller
            application.LoadController();
            // 5.启动端口
            application.start();
        })

    }
}