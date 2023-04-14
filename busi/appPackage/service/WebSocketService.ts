import { EndPoint, WsService } from "@ohuo_ozn/nea";
import {ssh2Service} from '@/service/ssh2Service'

@WsService('', 'webSocketService')
export class WebSocketService {
    private clients = [];

    @EndPoint('/api/ws')
    ws(ws, req, next) {
        let _this = this
        console.log("client connect to server successful!");
        _this.clients.push(ws);
        ws.on('message', function (msg) {
            console.log("receive client msg :", msg);
            _this.receiveCmd(msg);
        });
        ws.on("close", function (msg) {
            console.log("client is closed");
            for (var index = 0; index < _this.clients.length; index++) {
                if (_this.clients[index] == this) {
                    _this.clients.splice(index, 1)
                }
            }
        });
    }

    @EndPoint('/api/wsssh')
    wsssh(ws, req) {
        let _this = this
        console.log('/api/wsssh')
        new ssh2Service({
            host: '127.0.0.1',
            username: 'shengte',
            password: '1992229',
        }, ws)
    }


    receiveCmd(msg) {

    }


    /**
     * 发送command到client端
     * @param msg 
     * @param cb 
     */
    sendCmd(msg: string | string[] | object, cd?: any) {
        let _this = this;
        this.clients.forEach(ws => {
            if (typeof msg != 'string') {
                ws.send(JSON.stringify(msg))
            } else {
                ws.send(msg)
            }
        })
    }


}