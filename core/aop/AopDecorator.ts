import { application } from "../ioc/ApplicationContext"
import { getTargetId, log, proxify } from "../utils/CommonUtils"
import { AdviceInfo, PointcutInfo } from "./Interface"


export const Aspect = (): ClassDecorator => {
    /**
     * @param constructor 类构造函数
     */
    return (constructor: any) => {
        let classId = getTargetId(constructor)
        application.aspectManager.aspectClassArray.push({
            classId,
            constructor,
            className: constructor.name,
            instance: proxify(new constructor())
        })
    }
}

export const AspectMethodKey = 'AspectMethod'

function createAspect(type: string) {
    /**
     * @param exp:切点表达式<pr>
     * @param index:顺序
     */
    return (pointcutName: string, index?: number): MethodDecorator => {
        // 所属类prototype，被注解的方法，方法描述符
        return (targetPrototype: any, methodName: string, methodDecorator: PropertyDescriptor) => {
            let classId = getTargetId(targetPrototype)
            let fn = targetPrototype[methodName]
            const className = targetPrototype.constructor.name
            const aspectInfo: AdviceInfo = {
                classId,
                pointcutName,
                aspectFn: fn,
                type,
                className,
                targetPrototype,
                index: index || 100
            }
            let olds = Reflect.getMetadata(AspectMethodKey, methodDecorator.value) || []
            // log(olds)
            let news = [...olds, aspectInfo]
            // log(news)
            // 在此方法上添加aop信息
            Reflect.defineMetadata(AspectMethodKey, news, methodDecorator.value);

        }
    }
}

export const AspectPointcutKey = 'AspectPointcut'
/**
 * 
 * @param expression 切点表达式
 */
export const pointcut = (expression: string | string[]): MethodDecorator => {
    return <T>(targetPrototype: Object, methodName: string, methodDecorator: TypedPropertyDescriptor<T>) => {
        let classId = getTargetId(targetPrototype)
        let pointcutInfo: PointcutInfo = {
            classId,
            targetPrototype,
            className: targetPrototype.constructor.name,
            expressions: typeof expression == 'string' ? [expression] : expression,
            adviceInfos: [],
            pointcutName: methodName
        }
        let olds = Reflect.getMetadata(AspectMethodKey, methodDecorator.value) || []
        // log(olds)
        let news = [...olds, pointcutInfo]
        Reflect.defineMetadata(AspectPointcutKey, news, methodDecorator.value);
    }
}

export const before = createAspect('before')
export const after = createAspect('after')

export const EnableAspect = (): ClassDecorator => (targetClass: any) => {
    log('========================= Enable Aspect============================')
    application.isEnableAspect = true
}