import fs from 'fs';
import path from 'path'
import { Controllers } from './decorator/reflect-metadata/decorator';
import register from './decorator/reflect-metadata/register';

export const enableIoc = (app, rootPath: string, scanDirPaths: string[]) => {
    for (let i in scanDirPaths) {
        readDir((rootPath + "/" + scanDirPaths[i]).replace('//', '/'), rootPath);
    }
    // 注册 路由
    // console.log('注册路由=============>\n', Controllers)
    register(Controllers, '/', app);
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
                        requireComponent(`..${_path.replace(_rootPath, '')}`, fileName)
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
    console.log(`requireComponent`, className)
    let _t = require(filePath)
}