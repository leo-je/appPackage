import { AutoWired, Controller, Post } from "@/core";
import { ExportDatasourceService } from "../service/ExportDatasourceService";


@Controller('/api/dataSource')
class ExportDatasourceController {

    @AutoWired("exportDatasourceService")
    private exportDatasourceService: ExportDatasourceService

    @Post('/query')
    public query(req, res) {
        this.exportDatasourceService.query(req, res)
    }
}