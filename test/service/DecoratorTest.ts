
/**
 * 
 * @param name 类装饰器入参
 * @returns 
 */
export function classLog(name: string = ''): ClassDecorator {
    console.log("classLog", "1")
    // target  原构造器的引用
    /**
     * 
     */
    return (target: Function | void) => {
        console.log(target)
        console.log("classLog", "2")
    }
}

@classLog()
export class TestClass {

    public name:string = "TestClass"
    
    constructor() {
        console.log("TestClass constructor")
    }
    test() {
        console.log("test function")
    }
}

let t = TestClass
// t.test()