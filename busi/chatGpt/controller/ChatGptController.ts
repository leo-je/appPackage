import { AutoWired, Controller, Get, Query } from "@/core";
import { ChatGptService } from "../service/ChatGptService";

@Controller('/api/chatgpt')
class ChatGptController{

    @AutoWired('chatGptService')
    private chatGptService:ChatGptService

    @Get('/send')
    public async send(@Query('msg')msg:string){
        let data = await this.chatGptService.send(msg)
        return data;
    }

}