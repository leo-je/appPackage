import { After, Aspect, Before, log, Pointcut } from '@/core'

@Aspect()
class AspectTest {
  constructor () {
    log('AspectTest constructor')
  }

    @Pointcut('send2')
  public pointcut () {}

    @Before('pointcut')
    public b () {
      log('======== Before : b ==========')
    }

    @After('pointcut')
    public a (param) {
      log(param)
      log('======== After : b ==========')
    }
}
