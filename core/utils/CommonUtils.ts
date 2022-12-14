import { randomUUID } from "crypto";

export function proxify<T extends object>(obj: T): T {
    let handler = {
        get: function (target: T, prop: string, receiver: any) {
            // console.log(typeof receiver)
            // console.log(`prop: ${prop}, value: ${Reflect.get(target, prop, receiver)}`);
            return Reflect.get(target, prop, receiver);
        }
    }

    return new Proxy(obj, handler);
}


export function getTargetId(target: any | object): string | null {
    if (!target) return null
    let type = typeof target
    let id = null
    if (type == 'object') {
        id = target.constructor['__uuid']
        if (!id) {
            id = randomUUID()
            target.constructor['__uuid'] = id
        }
    }
    if (type == 'function') {
        id = target['__uuid']
        if (!id) {
            id = randomUUID()
            target['__uuid'] = id
        }
    }
    return id
}