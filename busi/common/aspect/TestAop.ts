import { Controller, Get } from "nea-boot";


@Controller('/api/aop')
class TestAop{

    @Get('/test')
    public test(){
        console.log('TestAop.test')
        return 'ok'
    }

}