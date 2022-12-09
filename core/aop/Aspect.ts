import util from 'util'

interface AspectInfo {
    aspectExp: string
    aspectFn: any
    type: string
}
class AspectManager {
    aspectClassMap: Map<string, any> = new Map()
    aspectMethodMap: Map<string, AspectInfo> = new Map()

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
                    _this.aspectMethodMap.set(aspectInfo.aspectExp, aspectInfo)
                })
            })
        })
    }

    public register() {

    }
}

export const aspectManager = new AspectManager()



export const Aspect = (): ClassDecorator => {
    return (TargetClass: any) => {
        aspectManager.aspectClassMap.set(TargetClass.name, proxify(new TargetClass()))
    }
}

const AspectMethodKey = 'AspectMethod'



function createAspect(type: string) {
    return (exp: string): MethodDecorator => {
        return (AspectClassTarget, methodName: string, methodDecorator: TypedPropertyDescriptor<any>) => {
            let fn = AspectClassTarget[methodName]
            const aspectInfo: AspectInfo = {
                aspectExp: exp,
                aspectFn: fn,
                type
            }
            let olds = Reflect.getMetadata(AspectMethodKey, AspectClassTarget, methodName) || []
            console.log(olds)
            let news = [...olds, aspectInfo]
            console.log(news)
            // 在此方法上添加aop信息
            Reflect.defineMetadata(
                AspectMethodKey,
                news,
                AspectClassTarget, methodName
            );
        }
    }
}

export const Before = createAspect('before')
export const After = createAspect('after')

const arr: any[] = []

export const EnableAspect = () => (targetClass: any) => {
    aspectManager.registerAspect()
    // 实例属性
    const inst = proxify(new targetClass())
    inst.isProxy = true
    const proto = Object.getPrototypeOf(inst);
    // 方法数组
    const methodNameArr = Object.getOwnPropertyNames(proto).filter(
        n => n !== 'constructor' && typeof proto[n] === 'function',
    );
    methodNameArr.forEach(methodName => {
        inst[methodName] = invoke(inst, methodName)
    })
    arr.push(inst)
}

function invoke(instance: any, methodName: string) {
    // 1.根据方法名获取切面执行数组 befores afters
    let isAsyncFunction = util.types.isAsyncFunction(instance[methodName])
    let oldFn = instance[methodName]
    let as = getAspects(instance, methodName)
    let newFu = async function (...args: any[]) {
        // console.log('arguments:' + arguments)
        // before
        for (let b in as.before) {
            await as.before[b].aspectFn(args)
        }
        // 原方法
        oldFn.apply(this, arguments);
        // after
        for (let b in as.after) {
            await as.after[b].aspectFn(args)
        }

    }
    return newFu;
}
interface Aspects {
    before?: AspectInfo[]
    after?: AspectInfo[]
}
function getAspects(instance: any, methodName: string) {
    let as: Aspects = {
        before: new Array(),
        after: new Array()
    }
    aspectManager.aspectMethodMap.forEach((value, key, map) => {
        // todo:方法匹配优化
        if (methodName == key) {
            if (value.type == 'before') {
                as.before.push(value)
            }
            if (value.type == 'after') {
                as.after.push(value)
            }
        }
    })
    return as;
}

function proxify<T extends object>(obj: T): T {
    let handler = {
        get: function (target: T, prop: string, receiver: any) {
            // console.log(typeof receiver)
            // console.log(`prop: ${prop}, value: ${Reflect.get(target, prop, receiver)}`);
            return Reflect.get(target, prop, receiver);
        }
    }

    return new Proxy(obj, handler);
}

export function testEnableAspect() {
    console.log('testEnableAspect:')
    arr[0]['test']('oldMsg')
}