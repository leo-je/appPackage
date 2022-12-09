import { After, Aspect, Before, EnableApplication, EnableAspect, testEnableAspect } from "./core";
import dotenv from 'dotenv'
dotenv.config()
require('module-alias/register')

//@EnableApplication({ port: +process.env.appPort, scanPath: ['/busi', '/sys'] })

@Aspect()
class AspectTest {

    constructor() {
        // console.log('constructor')
    }

    @Before('test')
    public b() {
        console.log('======== Before : b ==========')
    }

    @After('test')
    public a() {
        console.log('======== After : b ==========')
    }

}

@EnableAspect()
class Test {
    public async test(msg: string) {
        console.log('console test:' + msg)
    }
}

testEnableAspect()