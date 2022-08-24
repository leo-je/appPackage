<template>
  <div class="">
    <el-row>
      <el-col :span="24">
        <div class="grid-content ep-bg-purple-dark" />
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="2">
      </el-col>
      <el-col :span="2">
        <el-select v-model="environment" class="m-2" placeholder="Select">
          <el-option v-for="item in environmentOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-col>
      <el-col :span="6">
        <el-input v-model="processKey" placeholder="流程Key" clearable />
      </el-col>
      <el-col :span="2">
        <el-button type="success" @click="create">生成</el-button>
      </el-col>
      <el-col :span="12">
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="2">
      </el-col>
      <el-col :span="10">
        <el-input v-model="sql" :rows="10" type="textarea" placeholder="" :disabled="true" />
      </el-col>
      <el-col :span="12">
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="10">
      </el-col>
      <el-col :span="2">
        <el-button type="success" @click="downFile">下载</el-button>
        <el-button type="success" @click="copySql">复制
        </el-button>
      </el-col>
      <el-col :span="12">
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { ElMessage } from 'element-plus';

import http from "../utils/http";

export default defineComponent({
  setup() {
    return {
      processKey: ref(""),
      sql: ref(""),
      environment: ref("dev"),
      environmentOptions: [{ value: "dev", label: "dev" }, { value: "uat", label: "uat" }]
    };
  },
  components: {},
  mounted() {

  },
  methods: {
    create() {
      let data = {
        processKey: this.processKey,
        environment: this.environment
      }
      if (!data.environment || data.environment === '' || !data.processKey || data.processKey === '') {
        ElMessage.error('参数缺失!')
        return;
      }
      http('post', '/api/process/create', data).then(body => {
        console.log(body)
        this.sql = body
      }).catch(err => {
        ElMessage.error(err.message)
      })
    },
    downFile() {
      if (!this.sql || this.sql == '') {
        ElMessage.error("内容为空")
      } else
        this.funDownload(this.sql, this.processKey + '.sql')
    },
    funDownload(content: any, filename: any) {
      // 创建隐藏的可下载链接
      var eleLink = document.createElement('a');
      eleLink.download = filename;
      eleLink.style.display = 'none';
      // 字符内容转变成blob地址
      var blob = new Blob([content]);
      eleLink.href = URL.createObjectURL(blob);
      // 触发点击
      document.body.appendChild(eleLink);
      eleLink.click();
      // 然后移除
      document.body.removeChild(eleLink);
    },
    copySql() {
      // 获取需要复制的元素以及元素内的文本内容
      const text = this.sql
      // 添加一个input元素放置需要的文本内容
      const copyContent = document.createElement('input');
      copyContent.value = text;
      document.body.appendChild(copyContent);
      // 选中并复制文本到剪切板
      copyContent.select();
      document.execCommand('copy');
      // 移除input元素
      document.body.removeChild(copyContent);
      console.log('复制成功');
      ElMessage({
        message: 'copy success.',
        type: 'success',
      })

    },
    onCopy() {
      alert('Copied')
    },
    onError() {
      alert('onError')
    }
  },
  beforeCreate() {
    console.log("index");
  }
});
</script>


<style>
</style>