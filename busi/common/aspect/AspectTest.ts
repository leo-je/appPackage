import { After, Aspect, Before, Pointcut } from "@/core"

@Aspect()
class AspectTest {

    constructor() {
        console.log('AspectTest constructor')
    }

    @Pointcut('send2')
    public pointcut(){}

    @Before("pointcut")
    public b() {
        console.log('======== Before : b ==========')
    }

    @After("pointcut")
    public a(param) {
        console.log(param)
        console.log('======== After : b ==========')
    }

}