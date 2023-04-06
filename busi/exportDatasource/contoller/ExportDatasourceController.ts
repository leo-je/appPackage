import { AutoWired, Controller, Post } from "@/core";
import { ExportDatasourceService } from "../service/ExportDatasourceService";


@Controller('/api/dataSource')
class ExportDatasourceController {

    @AutoWired("exportDatasourceService")
    private exportDatasourceService: ExportDatasourceService

    @Post('/query')
    public async query(req, res) {
        let data =  await this.exportDatasourceService.query(req, res)
        return data;
    }
}