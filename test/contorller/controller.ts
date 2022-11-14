
import { Controller, Get, Query, Post, Body, Parse } from '../../core/decorator/reflect-metadata/decorator';
import { Request, Response } from "express"

@Controller("/test")
export default class TestController {

    @Get("/home")
    home() {
        let data = {a:122222}
       return data;
    }
}