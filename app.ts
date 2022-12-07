import { EnableApplication } from "./core";
import dotenv from 'dotenv'
dotenv.config()
require('module-alias/register')

@EnableApplication({ port: +process.env.appPort, scanPath: ['/busi', '/sys'] })
class TestApp {

}