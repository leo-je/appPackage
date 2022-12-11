import { EnableApplication, EnableAspect } from "./core";
import dotenv from 'dotenv'
dotenv.config()
import 'module-alias/register.js'


@EnableAspect()
@EnableApplication({ port: +process.env.appPort, scanPath: ['/busi', '/sys'] })
class Test {
    public async test(msg: string) {
        console.log('console test:' + msg)
    }
}