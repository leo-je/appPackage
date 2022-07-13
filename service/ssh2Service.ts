import { SSHClient } from 'ssh2'
const utf8 = require('utf8');

export class ssh2Service {
  ssh: SSHClient = null
  constructor(machineConfig, socket) {
    let _this = this
    if (this.ssh) this.ssh = null
    this.ssh = new SSHClient();
    const { host, username, password } = machineConfig;
    // 连接成功
    this.ssh.on('ready', function () {
      socket.send('\r\n*** SSH CONNECTION SUCCESS ***\r\n');
      _this.ssh.shell(function (err, stream) {
        // 出错
        if (err) {
          return socket.send('\r\n*** SSH SHELL ERROR: ' + err.message + ' ***\r\n');
        }
        // 前端发送消息
        socket.on('message', function (data) {
          stream.write(data);
        });
        // 通过sh发送消息给前端
        stream.on('data', function (d) {
          let context = "";
          try {
            // context = utf8.decode(d.toString('binary'))
            // console.log(context)
          } catch (e) {
            console.error(e)
          }
          socket.send(utf8.decode(d.toString('binary')));
          // socket.send(context);
          // 关闭连接
        }).on('close', function () {
          _this.ssh.end();
          _this.ssh = null
          console.log("========== stream close ==============")
          socket.close()
        });
      })

      // 关闭连接
    }).on('close', function () {
      socket.send('\r\n*** SSH CONNECTION CLOSED ***\r\n');
      // 连接错误
    }).on('error', function (err) {
      socket.send('\r\n*** SSH CONNECTION ERROR: ' + err.message + ' ***\r\n');
      // 连接
    }).connect({
      port: 22,
      host,
      username,
      password
    });
  }


}