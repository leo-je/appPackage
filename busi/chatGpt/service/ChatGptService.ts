import { Component } from "@/core";
import { getFormatDateTime } from "@/core/utils/DateUtils";
import { ChatGPTAPI } from 'chatgpt'

@Component('chatGptService')
export class ChatGptService {

    private chatGptApi: ChatGPTAPI

    constructor2() {
        console.log('ChatGptService.constructor')
        this.loadChatGptApi().catch(e => {
            console.log(e)
        })
    }

    public async loadChatGptApi() {
        let chatGptApi = new ChatGPTAPI({
            sessionToken: process.env.chatgptSession,
            clearanceToken: process.env.chatgptClearanceToken || '',
            userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36'
        })
        try {
            let auth = await chatGptApi.ensureAuth()
            console.log(`[ChatGptService.loadChatGptApi]-auth:${auth}`)
        } catch (e) {
            console.log(`[ChatGptService.loadChatGptApi]- refreshAccessToken fail`)
        }
        this.chatGptApi = chatGptApi
    }

    public async send2(msg: string) {
        console.log('send')
        return msg
    }

    public async send(msg: string) {
        let isAuthenticated = await this.chatGptApi.getIsAuthenticated();
        if (!isAuthenticated) {
            return {
                status: -1,
                message: 'fail authenticated'
            }
        } else {
            console.log(`[${getFormatDateTime()}]发送消息：${msg}`)
            let data = await this.chatGptApi.sendMessage(msg)
            console.log(`[${getFormatDateTime()}]返回消息：\n${data}`)
            return data
        }
    }


    public async conversation(msg: string) {
        let conversation = await this.chatGptApi.getConversation();
        if (!conversation) {
            return {
                status: -1,
                message: 'fail get a conversation'
            }
        } else {
            console.log(`[${getFormatDateTime()}]发送消息：${msg}`)
            let data = await conversation.sendMessage(msg)
            console.log(`[${getFormatDateTime()}]返回消息：\n${data}`)
            return data
        }
    }
}