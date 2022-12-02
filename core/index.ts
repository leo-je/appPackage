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
import { preComponent } from "./decorator/Component/PreComponent";


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
    WsService,EndPoint,registerWs,
    preComponent,
}