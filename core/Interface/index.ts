import { ComponentManager } from '../component/ComponentManager';
import { ControllerManager } from '../web/ControllerManager';
import { WebsocketManager } from '../ws/WebsocketManager';
import express from 'express'
import { AspectManager } from '../aop/AspectManager';

export interface InjectInfo {
    targetId: string
    target: object
    targetClassName: string,
    componentKey?: string | any
    propertyKey: string
}

export interface ComponentInfo {
    className: string
    componentName: string
    status: string
    value: any
    instance: any,
}

export interface ApplicationInterface {
    app?: express.Express // Express 实例
    appPort?: number// = 8080
    scanPath: string[]
    startTime: Date //= new Date()
    finishStartTime: Date
    isEnableAspect: boolean
    aspectManager: AspectManager
    controllerManager: ControllerManager
    componentManager: ComponentManager
    WebsocketManager: WebsocketManager
    start(): express.Express
    applicationStart(p?: { port?: number, scanPath?: string[] })
}

export interface WsRouteType {
    type: string;
    path: string;
    func: (...args: any[]) => any;
    loaded?: boolean;
}