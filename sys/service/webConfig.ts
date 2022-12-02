import { preComponent } from "@/core";
import express from 'express'
import cookieparser from 'cookie-parser'
import path from "path";
import { getFormatDateTime } from "@/core/utils/DateUtils";

@preComponent(0)
class WebConfig{

    enable(app){
        console.log(`[${getFormatDateTime()}][info][WebConfig]-`, "enable WebConfig")
        app.use(cookieparser());
        // 中间件
        app.use(express.json({ limit: '5mb' }));
        app.use(express.urlencoded({ extended: true }));
        let s_path = path.join(__dirname.replace('sys/service',''), 'ui/dist')
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