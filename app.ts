// es6
require('module-alias/register')
import { Express } from 'express'
import express from 'express'
import { WebSocketService } from './busi/appPackage/service/WebSocketService'
import path from 'path'
import { FileInfoService } from './busi/fileInfo/service/FileInfoService';
import { AppPackageSergvice } from './busi/appPackage/service/AppPackageSergvice';

import { ExportDatasource } from './service/exportDatasource';
import cookieparser from 'cookie-parser'

import { enableIoc, enableJwt, enableRouter } from './core';
import { getFormatDateTime } from './core/utils/DateUtils'
import { enableWs } from './core/ioc/ioc'



class App {

    private app: Express;

    public start() {
        this.app = express()
        const port = process.env.appPort
        this.app.use(cookieparser());
        // 中间件
        this.app.use(express.json({ limit: '5mb' }));
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(express.static(path.join(__dirname, 'ui/dist')));

        this.app.options('*', function (req, res, next) {
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
            res.setHeader('Access-Control-Allow-Headers', 'Authorization,X-Requested-With,content-type');
            res.setHeader('Access-Control-Allow-Credentials', 'true');
            next();
        });


        enableIoc(this.app,["/busi", "/sys"])
        enableWs(this.app)
        enableJwt(this.app,'jwtService')
        enableRouter(this.app)
        this.router();
        this.app.listen(port, () => {
            console.log(`[${getFormatDateTime()}][info][app]:`,`service app listening at \nhttp://0.0.0.0:${port}\nhttp://127.0.0.0:${port}\nhttp://localhost:${port}`)
        })
    }

    public router() {
        let exportDatasource = new ExportDatasource();
        this.app.post("/api/dataSource/query", async (req, res) => {
            exportDatasource.query(req, res)
        })
    }
}
new App().start()

// module-alias 别名包

// require中用@替代根路径
// require('node-require-alias').setAlias({
//     "@": path.join(__dirname, "")
// })
// or require('node-require-alias').setAlias("@", path.join(__dirname, "this/is/a/path"))




