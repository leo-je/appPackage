
import { Controller, Get, Query, Post, Body, Parse } from '../../core/decorator/decorator';
import { Request, Response } from "express"

@Controller("/test")
export default class TestController {

    @Get("/home")
    home(req: Request, res: Response) {
        let data = {a:122222}
        res.json(data)
    }
}