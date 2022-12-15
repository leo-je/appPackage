export interface AspectClassInfo {
    className: string
    constructor: FunctionConstructor
    instance: any
}

export interface PointcutInfo {
    targetPrototype: any
    className: string
    pointcutName: string
    expressions: string[]
    adviceInfos: AdviceInfo[]
}

export interface AdviceInfo {
    className: string
    pointcutName: string
    type: string
    targetPrototype: any
    index: number
    aspectFn: Function
}

export interface MethodAdvicesInfo {
    before?: AdviceInfo[]
    after?: AdviceInfo[]
}