import {
    CONTROLLER_METADATA,
    ROUTE_METADATA,
    PARAM_METADATA,
    PARSE_METADATA,
    Controller,
    createMethodDecorator,
    createParamDecorator,
    Parse, Get, Query, Post, Body
} from "./decorator/reflect-metadata/decorator";
import { Component, AutoWired, Inject,getComponentInstance } from "./decorator/Component/Component";
import { WsService,EndPoint,registerWs } from "./decorator/Component/WsComponent";
import { enableIoc, enableJwt, enableRouter } from './ioc/ioc';

export {
    CONTROLLER_METADATA,
    ROUTE_METADATA,
    PARAM_METADATA,
    PARSE_METADATA,
    Controller,
    createMethodDecorator,
    createParamDecorator,
    Parse,
    Get, Query, Post, Body, Component, AutoWired, Inject,getComponentInstance,
    enableIoc, enableJwt, enableRouter,
    WsService,EndPoint,registerWs,
}