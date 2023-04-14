import { Controller, Get } from "@ohuo_ozn/nea";


@Controller('/api/aop')
class TestAop{

    @Get('/test')
    public test(){
        console.log('TestAop.test')
        return 'ok'
    }

}