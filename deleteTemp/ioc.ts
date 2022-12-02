import { Express } from 'express'
import fs from 'fs';
import path from 'path'

import { registerWs } from '../decorator/Component/WsComponent';
import { register } from '../decorator/reflect-metadata/register';
import { application } from './ApplicationContext';

export const enableIoc = (app, scanDirPaths: string[]) => {
    // autoWiringComponents['app'] = {}
    // autoWiringComponents['app'].instance = app
    // autoWiringComponents['app'].value = 'app';
    // autoWiringComponents['app'].status = 'wired';
    // autoWiringComponents[app.className] = autoWiringComponents['app']

    let rootPath = __dirname.replace('/core/ioc', '')
    for (let i in scanDirPaths) {
        readDir((rootPath + "/" + scanDirPaths[i]).replace('//', '/'), rootPath);
    }
}
export const enableWs = (app: Express) => {
    registerWs(app)
}

export const enableJwt = (app: Express, componentName) => {
    let jwtService = application.getComponent(componentName);
    if (jwtService) {
        console.error(`enable jwt`)
        jwtService.instance.enable(app)
    } else {
        console.error(`${componentName} is undefined`)
    }
}

export const enableRouter = (app: Express) => {
    // 注册 路由
    // console.log('注册路由=============>\n', Controllers)
    register(application.controllers, '/', application.app);
}

function readDir(dirPath: string, _rootPath: string) {
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
                        requireComponent(`@${_path.replace(_rootPath, '')}`, fileName)
                        // requireComponent(`@${_path}`, fileName)
                    }
                } else if (/(\.git|ui|dist|core|node_modules)/.test(fileName)) {

                } else if (stat.isDirectory()) {
                    // console.log("isDirectory")
                    readDir(_path, _rootPath)
                }
            } catch (e) {
                console.error(e)
            }
        }
    } catch (err) {
        console.error(err)
    }

}

function requireComponent(filePath: string, className: string) {
    // console.log(filePath)
    //console.log(`requireComponent`, className)
    require(filePath)
    // console.log(`requireComponent-add`, className)
    // requireMap[className.replace('.js','').replace('.ts','')] = _t
}