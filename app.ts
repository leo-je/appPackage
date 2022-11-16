// es6
import { Express } from 'express'
import express from 'express'
import { WebSocketService } from './service/webSocketService'
import path from 'path'
import { FileInfoService } from './service/fileInfoService';
import { AppPackageSergvice } from './service/appPackageSergvice';
import { JwtService } from './service/jwtService';
import { UserService } from './service/userService';

import { ExportDatasource } from './service/exportDatasource';

import cookieparser from 'cookie-parser'
import expressWS from 'express-ws';
import { enableIoc } from './core/ioc';

const app: Express = express()

const port = process.env.appPort
app.use(cookieparser());
let wsApp = expressWS(app).app;
let webSocketService = new WebSocketService(wsApp);

let fileInfoService = new FileInfoService();
let exportDatasource = new ExportDatasource();
let appPackageSergvice = new AppPackageSergvice(webSocketService);

// 中间件
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({
    extended: true
}));

app.use(express.static(path.join(__dirname, 'ui/dist')));

app.options('*', function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Authorization,X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    next();
});

new JwtService().enableVerify(app, new UserService());
enableIoc(app, __dirname, ["/AppApi"])
app.post('/api/getFileList', function (req, res) {
    fileInfoService.getFileList(req, res);
})

app.post('/api/packageUatApp', express.json(), function (req, res) {
    appPackageSergvice.packageUatApp(req, res);
})


app.post('/api/getPackageLog', function (req, res) {
    appPackageSergvice.getPackageLog(req, res);
})

app.post('/api/packageProdApp', express.json(), function (req, res) {
    appPackageSergvice.packageProdApp(req, res);
})

app.post('/api/packageDebugApp', express.json(), function (req, res) {
    appPackageSergvice.packageDebugApp(req, res);
})

app.get("/api/down/:fileName", (req, res) => {
    fileInfoService.downFile(req, res)
})

app.post("/api/delete/:fileName", (req, res) => {
    fileInfoService.delete(req, res)
})

app.post("/api/cancelPackageApp", (req, res) => {
    appPackageSergvice.cancelPackageApp(req, res)
})

app.post("/api/dataSource/query", async (req, res) => {
    exportDatasource.query(req, res)
})

app.listen(port, () => {
    console.log(`service app listening at http://0.0.0.0:${port}`)
})