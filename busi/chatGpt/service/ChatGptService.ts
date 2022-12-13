import { Component } from "@/core";
import { getFormatDateTime } from "@/core/utils/DateUtils";
import { ChatGPTAPI } from 'chatgpt'

@Component('chatGptService')
export class ChatGptService {

    private chatGptApi

    constructor() {
        console.log('ChatGptService.constructor')
        this.loadChatGptApi().catch(e => {
            console.log(e)
        })
    }

    public async loadChatGptApi() {
        let chatGptApi = new ChatGPTAPI({
            sessionToken: process.env.chatgptSession
        })
        this.chatGptApi = chatGptApi
    }

    public async send(msg: string) {
        console.log(`[${getFormatDateTime()}]发送消息：${msg}`)
        let data = await this.chatGptApi.sendMessage(msg)
        console.log(`[${getFormatDateTime()}]返回消息：\n${data}`)
        return data
    }

}