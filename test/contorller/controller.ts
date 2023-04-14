import { Controller, Get } from "@ohuo_ozn/nea";

@Controller("/test")
export default class TestController {

    @Get("/index")
    home() {
        let data = {a:122222}
       return data;
    }
}