import { EnableAspect, EnableApplication } from '@ohuo_ozn/nea'
import 'module-alias/register.js'

@EnableAspect()
@EnableApplication({ port: +process.env.appPort, scanPath: ['busi'] })
class Test {
    public async test(msg: string) {
        console.log('console test:' + msg)
    }
}