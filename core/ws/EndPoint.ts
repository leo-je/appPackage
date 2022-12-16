export const EndPoint = (path = '/'): MethodDecorator => {
    return (target: object, name: string, descriptor: any) => {
        // target：当前类实例，name：当前函数名，descriptor：当前属性（函数）的描述符
        Reflect.defineMetadata(
            'info',
            { type: 'ws', path },
            descriptor.value,
        );
    }
}