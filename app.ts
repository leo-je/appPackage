import { ExpressApp } from "./core/decorator/ExpressApp";
import dotenv from 'dotenv'
dotenv.config()

@ExpressApp({ port: +process.env.appPort, scanPath: ['/busi', '/sys'] })
class TestApp {

}