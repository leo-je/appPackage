import { Controller, Get } from "@/core";


@Controller('/api/aop')
class TestAop{

    @Get('/test')
    public test(){
        console.log('TestAop.test')
        return 'ok'
    }

}