import { ComponentInfo } from 'core/Interface'
import util from 'util'
import { log } from '../utils/CommonUtils'
import { AspectMethodKey, AspectPointcutKey } from './AopDecorator'
import { AdviceInfo, AspectClassInfo, MethodAdvicesInfo, PointcutInfo } from './Interface'


export class AspectManager {

    /**
     * class集合
     */
    aspectClassArray: AspectClassInfo[] = []
    /**
     * [className:PointcutInfo[]]
     */
    aspectPointcutMap: Map<string, PointcutInfo[]> = new Map()
    /**
     * [className.PointcutName:AdviceInfo[]]
     */
    aspectMethodMap: Map<string, AdviceInfo[]> = new Map()

    public registerAspect() {
        let _this = this
        this.aspectClassArray.forEach((aspectClassInfo: AspectClassInfo, index: number, array: AspectClassInfo[]) => {
            // 实例属性
            const proto = Object.getPrototypeOf(aspectClassInfo.instance);
            // 方法数组
            const functionNameArr = Object.getOwnPropertyNames(proto).filter(
                n => n !== 'constructor' && typeof proto[n] === 'function',
            );
            functionNameArr.forEach(functionName => {
                let aspectInfos: AdviceInfo[] = Reflect.getMetadata(AspectMethodKey, proto[functionName]);
                if (aspectInfos) {
                    aspectInfos.forEach(aspectInfo => {
                        let key = aspectClassInfo.className + '_' + aspectClassInfo.classId + '.' + aspectInfo.pointcutName
                        let as: AdviceInfo[] = _this.aspectMethodMap.get(key)
                        if (!as) {
                            as = []
                        }
                        as.push(aspectInfo)
                        _this.aspectMethodMap.set(key, as)
                    })
                }
                let pointcutInfos: PointcutInfo[] = Reflect.getMetadata(AspectPointcutKey, proto[functionName]);
                if (pointcutInfos) {
                    pointcutInfos.forEach((pointcutInfo: PointcutInfo, index: number, array: PointcutInfo[]) => {
                        let key = pointcutInfo.className + '_' + pointcutInfo.classId
                        let ps: PointcutInfo[] = this.aspectPointcutMap.get(key)
                        if (!ps) {
                            ps = []
                        }
                        ps.push(pointcutInfo)
                        _this.aspectPointcutMap.set(key, ps)
                    })
                }
            })
        })
        // aspectPointcutMap
        this.aspectPointcutMap.forEach((pointcutInfos: PointcutInfo[], className: string, map: Map<string, PointcutInfo[]>) => {
            pointcutInfos.forEach((pointcutInfo: PointcutInfo, index: number, array: PointcutInfo[]) => {
                let key = pointcutInfo.className + '_' + pointcutInfo.classId + '.' + pointcutInfo.pointcutName
                let adviceInfos: AdviceInfo[] = this.aspectMethodMap.get(key)
                if (adviceInfos) {
                    pointcutInfo.adviceInfos = adviceInfos
                }
            })
        })
    }

    public invoke(instance: any, methodName: string): (...args: any[]) => Promise<any> {
        // 1.根据方法名获取切面执行数组 befores afters
        let isAsyncFunction = util.types.isAsyncFunction(instance[methodName])
        let original = instance[methodName]
        let as = this.getMethodAspectsInfo(instance, methodName)
        if (as.before.length <= 0 && as.after.length <= 0) {
            return null
        }
        let newFn = async function (...args: any[]) {
            // log('arguments:' + arguments)
            // before
            for (let b in as.before) {
                await as.before[b].aspectFn(...args)
            }
            // 原方法
            let result = await original.apply(this, arguments);
            // after
            for (let b in as.after) {
                await as.after[b].aspectFn({ originalArgs: args, result })
            }
            return result
        }
        return newFn;
    }

    public getMethodAspectsInfo(instance: any, methodName: string) {
        let as: MethodAdvicesInfo = {
            before: new Array(),
            after: new Array()
        }
        this.aspectPointcutMap.forEach((pointcutInfos: PointcutInfo[], _className_PointcutName: string, _map: Map<string, PointcutInfo[]>) => {
            pointcutInfos.forEach((pointcutInfo: PointcutInfo, index: number, array: PointcutInfo[]) => {
                // todo:方法匹配优化
                //log(`=========================methodName:${methodName} --- key:${key} =========================`)
                let isPointcut = false
                let expressions = pointcutInfo.expressions
                expressions.forEach(expression => {
                    if (new RegExp(expression).test(methodName)) {
                        log('[pointcut]' + pointcutInfo.pointcutName + ': ' + instance.constructor.name + '-' + methodName)
                        isPointcut = true
                    }
                })
                if (isPointcut) {
                    // log('========================= 符合条件 =========================')
                    for (let i in pointcutInfo.adviceInfos) {
                        let ai = pointcutInfo.adviceInfos[i]
                        if (ai.type == 'before') {
                            as.before.push(ai)
                        }
                        if (ai.type == 'after') {
                            as.after.push(ai)
                        }
                    }
                }
            })
        })

        // 根据index排序
        // 从小到大的排序 
        as.after.sort((Acomponent, Bcomponent) => {
            return Acomponent.index - Bcomponent.index;
        });
        as.before.sort((Acomponent, Bcomponent) => {
            return Acomponent.index - Bcomponent.index;
        });
        return as;
    }


    public enableAspect(isEnableAspect: boolean, componentsOnName: Map<string, ComponentInfo>) {
        if (isEnableAspect) {
            log('========================= register Aspect==========================')
            // 注册各个切点方法
            this.registerAspect()
            // 实例属性
            componentsOnName.forEach((component: ComponentInfo, _key: string, _map: Map<string, any>) => {
                this.proxyMethod(component)
            })
        }
    }

    private async proxyMethod(component: ComponentInfo) {
        // log(key)
        // instance.isProxy = true
        const instance = component.instance
        const proto = Object.getPrototypeOf(instance);
        // 方法数组
        const methodNameArr = Object.getOwnPropertyNames(proto).filter(
            n => n !== 'constructor' && typeof proto[n] === 'function',
        );
        const proxy = async (methodName) => {
            const strArray = ['toString', 'valueOf', '__defineGetter__', '__defineSetter__',
                'hasOwnProperty', '__lookupSetter__',
                '__lookupGetter__', 'isPrototypeOf',
                '__lookupSetter__ ', 'propertyIsEnumerable', 'toLocaleString'];
            const hasString = strArray.includes(methodName);
            if (hasString) return;
            const invokeMethod = this.invoke(instance, methodName)
            if (invokeMethod) {
                instance[methodName] = invokeMethod
            }
        }
        methodNameArr.forEach(methodName => {
            proxy(methodName)
        })
    }
}