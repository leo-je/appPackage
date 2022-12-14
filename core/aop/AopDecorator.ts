import { application } from "../ioc/ApplicationContext"
import { proxify } from "../utils/CommonUtils"
import { AspectInfo } from "./Interface"


export const Aspect = (): ClassDecorator => {
    /**
     * @param constructor 类构造函数
     */
    return (constructor: any) => {
        application.aspectManager.aspectClassMap.set(constructor.name, proxify(new constructor()))
    }
}

export const AspectMethodKey = 'AspectMethod'

function createAspect(type: string) {
    /**
     * @param exp:切点表达式<pr>
     * @param index:顺序
     */
    return (param: { exp: string, index?: number }): MethodDecorator => {
        // 所属类prototype，被注解的方法，方法描述符
        return (target: any, methodName: string, methodDecorator: PropertyDescriptor) => {

            let fn = target[methodName]
            const className = target.constructor.name
            const aspectInfo: AspectInfo = {
                aspectExp: param.exp,
                aspectFn: fn,
                type,
                className,
                target,
                index: param.index || 100
            }
            let olds = Reflect.getMetadata(AspectMethodKey, methodDecorator.value) || []
            // console.log(olds)
            let news = [...olds, aspectInfo]
            // console.log(news)
            // 在此方法上添加aop信息
            Reflect.defineMetadata(AspectMethodKey, news, methodDecorator.value);

        }
    }
}

export const Before = createAspect('before')
export const After = createAspect('after')

export const EnableAspect = (): ClassDecorator => (targetClass: any) => {
    console.log('========================= Enable Aspect============================')
    application.isEnableAspect = true
}