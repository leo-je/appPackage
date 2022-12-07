import { AutoWired, Controller, Get, Post } from "@/core";
import { AppPackageSergvice } from "../service/AppPackageSergvice";


@Controller("/api")
class AppPackageController {

    @AutoWired("appPackageSergvice")
    private appPackageSergvice: AppPackageSergvice;

    @Post('/packageUatApp')
    packageUatApp(req, res) {
        this.appPackageSergvice.packageUatApp(req, res);
    }
    @Post('/getPackageLog')
    getPackageLog(req, res) {
        this.appPackageSergvice.getPackageLog(req, res);
    }

    @Post('/packageProdApp')
    packageProdApp(req, res) {
        this.appPackageSergvice.packageProdApp(req, res);
    }

    @Post('/packageDebugApp')
    packageDebugApp(req, res) {
        this.appPackageSergvice.packageDebugApp(req, res);
    }

    @Post("/cancelPackageApp")
    cancelPackageApp(req, res) {
        this.appPackageSergvice.cancelPackageApp(req, res)
    }

    @Get("/getAllBranch")
    getAllBranch(req, res) {
        return this.appPackageSergvice.getAllBranch()
    }

}