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
        <el-input v-model="sql" :rows="10" type="textarea" placeholder="Please input" />
      </el-col>
      <el-col :span="12">
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="10">
      </el-col>
      <el-col :span="2">
        <el-button round>下载</el-button>
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
      environment: ref(""),
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
    }
  },
  beforeCreate() {
    console.log("index");
  }
});
</script>


<style>
</style>