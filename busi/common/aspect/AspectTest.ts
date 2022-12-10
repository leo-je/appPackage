import { After, Aspect, Before } from "@/core"

@Aspect()
class AspectTest {

    constructor() {
        console.log('AspectTest constructor')
    }

    @Before({ exp: 'test' })
    public b() {
        console.log('======== Before : b ==========')
    }

    @After({ exp: 'test' })
    public a(param) {
        console.log(param)
        console.log('======== After : b ==========')
    }

}