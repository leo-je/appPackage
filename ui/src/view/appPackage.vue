<template>
  <div id="appPackage">
    <!-- <el-header class="container-header">package caih App</el-header> -->
    <el-row class="command-button">
      <el-col :span="2" />
      <el-col :span="1">
        <el-button type="primary" @click="getFileList">刷新列表</el-button>
      </el-col>
      <el-col :span="4">
        <div style="">
          <el-input style="margin-left: 22px;" v-model="branch" placeholder="请输入分支名称" />
        </div>
      </el-col>

      <el-col :span="6">
        <div style="margin-left: 10px;">
          <el-button type="primary" @click="packageUatApp">uat打包</el-button>
          <el-button type="primary" @click="packageDebugApp">debug打包</el-button>
          <el-button type="primary" @click="packageProdApp">prod打包</el-button>
          <!-- <el-button type="primary" @click="cancelPackageApp">取消打包</el-button> -->
          <!-- </el-col>

              <el-col :span="4">-->
          <el-button type="primary" @click="openLogWindows">查看日志</el-button>
          <!-- <el-button type="primary" @click="openSSHWindows">打开cmd</el-button> -->
        </div>
      </el-col>
      <!-- <el-col :span="11"></el-col> -->
    </el-row>

    <el-row class="file-list">
      <el-col :span="2"></el-col>
      <el-col :span="11">
        <div id="tableData">
          <el-table :data="tableData" border>
            <el-table-column prop="fileName" label="文件名" width="240">
              <template #default="scope">
                <el-button type="text" size="small" @click.prevent="down(scope.$index, tableData)">{{
                    tableData[scope.$index]["fileName"]
                }}</el-button>
              </template>
            </el-table-column>
            <el-table-column prop="size" label="文件大小" width="180" />
            <el-table-column prop="updateTime" label="更新时间" width="180" />
            <el-table-column prop="addr" label>
              <template #default="scope">
                <el-button type="text" size="small" @click.prevent="down(scope.$index, tableData)">下载</el-button>
                <el-button type="text" size="small" @click.prevent="deleteRow(scope.$index, tableData)">删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-col>
      <!-- <el-col :span="12"></el-col> -->
    </el-row>

    <el-dialog v-model="sshDialogVisible" append-to-body="true" title="cmd" width="80%" @opened="onSShOpened">
      <div id="terminal" ref="terminalRef"></div>
    </el-dialog>

    <el-dialog v-model="dialogVisible" append-to-body="true" title="日志" width="60%" @opened="onOpened">
      <el-input :id="'textlog'" v-model="packageLog" :autosize="{ minRows: 2, maxRows: 25 }" :readonly="true"
        type="textarea" placeholder @input="onOpened" :input-style="{
          'background-color': '#554a4a',
          color: 'white',
          'font-size': '14px',
          'font-weight': '400',
          'font-family': 'monospace'
        }"></el-input>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import http from "../utils/http";
import moment from "moment";
import { ElMessage } from "element-plus";
import { Terminal } from "xterm";
import { FitAddon } from 'xterm-addon-fit'
import { AttachAddon } from 'xterm-addon-attach'
import "xterm/css/xterm.css";
import "xterm/lib/xterm.js";

let term: Terminal | undefined;
let shellWs: WebSocket;
export default defineComponent({
  setup() {
    return {
      terminalRef: ref(HTMLElement),
      ws: ref({}),
      wsHost: ref(location.host),
      timer: ref(0),
      tableData: ref([]),
      dialogVisible: ref(false),
      sshDialogVisible: ref(false),
      packageLog: ref(""),
      branch: ref("develop")
    };
  },
  components: {},
  mounted() {
    let _this = this;
    this.getFileList();
    this.initWs();
    //this.timer = setInterval(() => { _this.getLog() }, 1000);
    this.getLog();
    // this.initTerm();
  },
  methods: {
    initTerm() {
      const t = document.getElementById("terminal")
      if (!term && t) {
        this.wsShell()
        term = new Terminal({
          rendererType: "canvas", //渲染类型
          rows: 40,//parseInt(_this.rows), //行数
          // cols: 180, // 不指定行数，自动回车后光标从下一行开始
          //  convertEol: true, //启用时，光标将设置为下一行的开头
          scrollback: 500, //终端中的回滚量
          //  disableStdin: false, //是否应禁用输入。
          cursorStyle: "underline", //光标样式
          cursorBlink: true, //光标闪烁
          theme: {
            foreground: "#7e9192", //字体
            background: "#002833", //背景色
            cursor: "help", //设置光标
            // lineHeight: 16
          },
        });
        const attachAddon = new AttachAddon(shellWs);
        const fitAddon = new FitAddon();
        term.loadAddon(attachAddon);
        term.loadAddon(fitAddon);
        // 创建terminal实例
        term.open(t);
        // fitAddon.fit();
        // 换行并输入起始符“$”
        // term.write("\r\n$ ");
        term.focus();
      }
    },
    openSSHWindows() {
      let _this = this;
      this.sshDialogVisible = true;
    },
    onSShOpened() {
      this.initTerm()
    },
    initWs() {
      this.ws = {};
      let _this = this;
      let wsPath = "ws://" + _this.wsHost + "/api/ws";
      console.log(wsPath);
      var ws = new WebSocket(wsPath);
      ws.onopen = function (evt) {
        console.log("Connection open ...");
        ws.send("Hello WebSockets!");
      };
      ws.onmessage = function (evt) {
        // console.log(evt.data);
        let data = JSON.parse(evt.data);
        if (data["dataType"] == "packLog") {
          _this.packageLog = _this.packageLog + data["data"];
          _this.onOpened();
        }
      };
      ws.onclose = function (evt) {
        console.log("Connection closed.");
        _this.initWs()
      };
      this.ws = ws;
    },
    cancelPackageApp() {
      let _this = this;
      console.log(_this.branch);
      http("post", "/api/cancelPackageApp").then(function (data) {
        console.log(data);
        ElMessage(data.msg);
        _this.packageLog = _this.packageLog + "\ncancelPackageApp";
      });
    },
    packageUatApp() {
      let _this = this;
      console.log(_this.branch);
      http("post", "/api/packageUatApp", { branch: _this.branch }).then(
        function (data) {
          console.log(data);
          ElMessage(data.msg);
        }
      );
    },
    packageDebugApp() {
      let _this = this;
      console.log(_this.branch);
      http("post", "/api/packageDebugApp", { branch: _this.branch }).then(
        function (data) {
          console.log(data);
          ElMessage(data.msg);
        }
      );
    },
    packageProdApp() {
      let _this = this;
      http("post", "/api/packageProdApp", { branch: _this.branch }).then(
        function (data) {
          console.log(data);
          ElMessage(data.msg);
        }
      );
    },
    openLogWindows() {
      let _this = this;
      _this.dialogVisible = true;
    },
    getLog() {
      let _this = this;
      http("post", "/api/getPackageLog").then(function (data) {
        _this.packageLog = data.log;
      });
    },
    getFileList() {
      let _this = this;
      http("post", "/api/getFileList")
        .then(function (data) {
          console.log(data);
          let tableData = data.data;
          if (tableData && tableData.length > 0) {
            console.log(tableData);
            tableData = tableData.sort(function (a: any, b: any) {
              let t1 = new Date(Date.parse(a["updateTime"]));
              let t2 = new Date(Date.parse(b["updateTime"]));
              console.log(t1);
              console.log(t2);
              return a["updateTime"] > b["updateTime"];
            });
            console.log(tableData);
            tableData.forEach((element: { updateTime: any }) => {
              element.updateTime = moment(element.updateTime).format(
                "YYYY/MM/DD HH:mm:ss"
              );
            });
            _this.tableData = data.data;
          }
        })
        .catch(function (e) {
          console.error(e);
        });
    },
    down(index: any, rows: any) {
      console.log(index);
      console.log(rows);
      location.href = "/api/down/" + rows[index].fileName;
    },
    deleteRow(index: any, rows: any) {
      let _this = this;
      http("post", "/api/delete/" + rows[index].fileName).then(function (data) {
        _this.getFileList();
      });
    },
    updatePackLog() { },
    onOpened() {
      var textarea = document.getElementById("textlog");
      //console.log(textarea)
      if (textarea) textarea.scrollTop = textarea.scrollHeight;
    },
    /**
     * 对数组中的对象，按对象的key进行sortType排序
     * @param key 数组中的对象为object,按object中的key进行排序
     * @param sortType true为降序；false为升序
     */
    keysort(key: string, sortType: boolean) {
      let fn = function (a: any, b: any) {
        // ~~数字类型的字符串可以转化为纯数字
        console.log(~~(new Date(a[key]) < new Date(b[key])));
        return sortType
          ? ~~(new Date(Date.parse(a[key])) < new Date(Date.parse(b[key])))
          : ~~(new Date(Date.parse(a[key])) > new Date(Date.parse(b[key])));
      };
      return fn;
    },
    /**
     * **wsShell 创建页面级别的websocket,加载页面数据
     * ws 接口:/xxx/xxx/xxx
     * 参数:无
     * ws参数:
     * @deployId   任务id
     * @tagString  当前节点
     * 返回:无
     * **/
    wsShell() {
      const _this = this;
      let url = 'ws://' + _this.wsHost + '/api/wsssh'; // websocket连接接口

      shellWs = new WebSocket(url);
      shellWs.onopen = function (evt) {
        console.log("Connection shell open ...");
        // shellWs.send("Hello WebSockets!");
      };
      // shellWs.onmessage = function (evt) {
      //   // console.log(evt.data);
      //   // let data = JSON.parse(evt.data);
      //   // 打印后端返回数据
      //   if (term) {
      //     // term.write(evt.data);
      //   }

      // };
      shellWs.onclose = function (evt) {
        console.log("Connection closed.");
        const t = document.getElementById("terminal")
        if (t) {
          t.innerHTML = ''
        }
        term = undefined
      };
    },
    // onSend(data: string) {
    //   data = data.replace(/\\\\/, "\\");
    //   this.shellWs.send(data);
    // },


  },
  beforeCreate() {
    console.log("index");
  }
});
</script>


<style lang="scss"  scoped>
.file-list {
  margin-top: 20px;
  /* line-height: 600px; */
}

#tableData {
  width: 100%;
}
</style>