import { Express } from 'express'
import { Application } from 'express-ws';
const ssh2Service = require('./ssh2Service')

export class WebSocketService {
    app: Application = null;
    clients = [];
    constructor(app: Application) {
        let _this = this;
        this.app = app
        this.app.ws('/api/ws', function (ws, req) {
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
        });

        this.app.ws('/api/wsssh', function (ws, req) {
            ssh2Service.createNewServer({
                host: '127.0.0.1',
                username: 'shengte',
                password: '1992229',
            }, ws)
        });
    }

    receiveCmd = function (msg) {

    }


    /**
     * 发送command到client端
     * @param msg 
     * @param cb 
     */
    sendCmd = function (msg: string | string[] | object, cd?: any) {
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