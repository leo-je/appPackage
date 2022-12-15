import { After, Aspect, Before, Pointcut } from "@/core"

@Aspect()
class AspectTest {

    constructor() {
        console.log('AspectTest constructor')
    }

    @Pointcut('send')
    public pointcut(){}

    @Before("")
    public b() {
        console.log('======== Before : b ==========')
    }

    @After("")
    public a(param) {
        console.log(param)
        console.log('======== After : b ==========')
    }

}