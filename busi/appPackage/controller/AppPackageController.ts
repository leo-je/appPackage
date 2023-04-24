import { AutoWired, Controller, Get, Post } from "nea-boot";
import { AppPackageService } from "../service/AppPackageService";


@Controller("/api")
class AppPackageController {

    @AutoWired("appPackageService")
    private appPackageService: AppPackageService;

    @Post('/packageUatApp')
    packageUatApp(req, res) {
        this.appPackageService.packageUatApp(req, res);
    }
    @Post('/getPackageLog')
    getPackageLog(req, res) {
        this.appPackageService.getPackageLog(req, res);
    }

    @Post('/packageProdApp')
    packageProdApp(req, res) {
        this.appPackageService.packageProdApp(req, res);
    }

    @Post('/packageDebugApp')
    packageDebugApp(req, res) {
        this.appPackageService.packageDebugApp(req, res);
    }

    @Post("/cancelPackageApp")
    cancelPackageApp(req, res) {
        this.appPackageService.cancelPackageApp(req, res)
    }

    @Get("/getAllBranch")
    getAllBranch(req, res) {
        return this.appPackageService.getAllBranch()
    }

    @Get("/getShData")
    getShData() {
        return this.appPackageService.getShData()
    }

}