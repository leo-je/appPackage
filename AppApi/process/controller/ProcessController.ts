
import { Controller, Get, Query, Post, Body, Parse } from '../../core/decorator/reflect-metadata/decorator';
import { Request, Response } from "express"
import { ExportProcess } from '../../service/exportProcess';

@Controller("/api/process")
export default class ProcessController {

    @Post("/create")
    async create(req:Request,res:Response) {
       let sql = await new ExportProcess().create(req,res)
        return sql;
    }
}