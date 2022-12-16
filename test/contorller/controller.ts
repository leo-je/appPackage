import { Controller, Get } from "@/core";

@Controller("/test")
export default class TestController {

    @Get("/index")
    home() {
        let data = {a:122222}
       return data;
    }
}