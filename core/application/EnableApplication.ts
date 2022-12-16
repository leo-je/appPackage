import { application } from "./ApplicationContext"

export const EnableApplication = (p?: { port?: number, scanPath?: string[] }): ClassDecorator => {
    return (_targetClass: any) => {
        application.applicationStart(p)
    }
}