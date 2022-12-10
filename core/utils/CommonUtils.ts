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