import { AutoWired, Controller, Get, Post } from "nea-boot";
import { FileInfoService } from "../service/FileInfoService";

@Controller('/api')
class FileInfoController {

    @AutoWired('fileInfoService')
    private fileInfoService: FileInfoService;

    @Post('/getFileList')
    getFileList(req, res) {
        return this.fileInfoService.getFileList(req, res);
    }

    @Get("/down/:fileName")
    async downFile(req, res) {
        return this.fileInfoService.downFile(req, res)
    }

    @Post("/delete/:fileName")
    delete(req, res) {
        return this.fileInfoService.delete(req, res)
    }
}