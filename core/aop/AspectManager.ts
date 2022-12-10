import util from 'util'
import { application } from '../ioc/ApplicationContext'
import { AspectMethodKey } from './AopDecorator'
import { AspectInfo, MethodAspectsInfo } from './Interface'


export class AspectManager {
    aspectClassMap: Map<string, any> = new Map()
    aspectMethodMap: Map<string, AspectInfo[]> = new Map()

    public registerAspect() {
        let _this = this
        this.aspectClassMap.forEach((instance: any, key: string, map: Map<string, any>) => {
            // 实例属性
            const proto = Object.getPrototypeOf(instance);
            // 方法数组
            const functionNameArr = Object.getOwnPropertyNames(proto).filter(
                n => n !== 'constructor' && typeof proto[n] === 'function',
            );
            functionNameArr.forEach(functionName => {
                let aspectInfos: AspectInfo[] = Reflect.getMetadata(AspectMethodKey, proto[functionName]);
                if (!aspectInfos) return;
                aspectInfos.forEach(aspectInfo => {
                    let as = _this.aspectMethodMap.get(aspectInfo.aspectExp)
                    if (!as) {
                        as = []
                    }
                    as.push(aspectInfo)
                    _this.aspectMethodMap.set(aspectInfo.aspectExp, as)
                })
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
            // console.log('arguments:' + arguments)
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
        let as: MethodAspectsInfo = {
            before: new Array(),
            after: new Array()
        }
        application.aspectManager.aspectMethodMap.forEach((value, key, map) => {
            // todo:方法匹配优化
            //console.log(`=========================methodName:${methodName} --- key:${key} =========================`)
            if (methodName == key) {
                // console.log('========================= 符合条件 =========================')
                for (let i in value) {
                    let ai = value[i]
                    if (ai.type == 'before') {
                        as.before.push(ai)
                    }
                    if (ai.type == 'after') {
                        as.after.push(ai)
                    }
                }
            }
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
}




export function testEnableAspect() {
    console.log('testEnableAspect:')
    //testArr[0]['test']('oldMsg')
}