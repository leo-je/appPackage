import { log, PreComponent } from "@ohuo_ozn/nea";
import { Express } from 'express'
import express from 'express'
import cookieparser from 'cookie-parser'
import path from "path";

@PreComponent(0)
class WebConfig {

    enable(app: Express) {
        log(`[WebConfig]- "enable WebConfig`)
        app.use(cookieparser());
        // 中间件
        app.use(express.json({ limit: '5mb' }));
        app.use(express.urlencoded({ extended: true }));
        let s_path = path.join(process.cwd(), 'ui/dist')
        app.use(express.static(s_path));

        app.options('*', function (req, res, next) {
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
            res.setHeader('Access-Control-Allow-Headers', 'Authorization,X-Requested-With,content-type');
            res.setHeader('Access-Control-Allow-Credentials', 'true');
            next();
        });
    }
}