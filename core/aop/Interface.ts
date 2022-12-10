export interface AspectInfo {
    aspectExp: string
    aspectFn: any
    type: string
    className: string
    target: any,
    index: number
}

export interface MethodAspectsInfo {
    before?: AspectInfo[]
    after?: AspectInfo[]
}