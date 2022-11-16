
import { Controller, Get, Query, Post, Body, Parse } from '../../../core/decorator/reflect-metadata/decorator';
import { Request, Response } from "express"
import { AutoWired, Inject } from '../../../core/decorator/Component/Component';
import { ExportProcess } from '../service/ExportProcess';



@Controller("/api/process")
class ProcessController {

    @Inject
    public exportProcess:ExportProcess

    @AutoWired("exportProcess")
    public exportProcess2:ExportProcess

    @Post("/create")
    async create(req:Request,res:Response) {
        console.log(this)
        console.log(this.exportProcess)
        console.log(this.exportProcess2)
       let sql = this.exportProcess2.create(req,res)
        return sql;
    }
}