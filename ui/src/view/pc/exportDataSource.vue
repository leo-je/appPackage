<template>
  <div class="">
    <el-row>
      <el-col :span="24">
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
        <el-input v-model="sourceName" placeholder="数据源名称" clearable />
      </el-col>
      <el-col :span="2">
        <el-button type="success" @click="query(1,null)">查询</el-button>
      </el-col>
      <el-col :span="12">
        <div style="text-align: left;margin-top: 9px;font-size: 14px;color: red;">
          <!-- <span>重要提示:先停用,后导出导入!</span> -->
        </div>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="2">
      </el-col>
      <el-col :span="18">
        <div style="margin-top: 20px;">
          <el-table :data="tableData" style="width: 100%" highlight-current-row>
            <el-table-column prop="sourceType" label="类型" />
            <el-table-column prop="sourceName" label="名称" />
            <el-table-column prop="gmtCreate" label="创建时间" :formatter="Timeformatter"/>
            <el-table-column prop="apiUrl" label="API地址" />
            <el-table-column fixed="right" label="操作" width="120">
              <template #default="scope">
                <el-button link type="primary" size="small" @click="copySql(scope.row)">复制</el-button>
                <el-button link type="primary" size="small" @click="downFile(scope.row)">下载</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination v-model:currentPage="table.pageInfo.pageNum" v-model:page-size="table.pageInfo.pageSize"
            :page-sizes="[10, 20,]" layout="sizes, prev, pager, next" :total="table.pageInfo.total"
            @size-change="handleSizeChange" @current-change="handleCurrentChange" />
        </div>
      </el-col>
      <el-col :span="4">
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { ElMessage } from 'element-plus';
import moment from "moment";
import http from "../../utils/http";

class DataSource {
  id?: string
  sourceType?: string
  sourceName?: string
  gmtCreate?: Date
  apiUrl?: string
  sql?: string
}
let tableData: Array<DataSource>
export default defineComponent({
  setup() {
    return {
      sourceName: ref(""),
      sql: ref(""),
      environment: ref("dev"),
      environmentOptions: [{ value: "dev", label: "dev" }, { value: "uat", label: "uat" }],
      table: ref({
        pageInfo: {
          pageSize: 10,
          pageNum: 1,
          total: 0
        }
      }),
      tableData: ref(tableData)
    };
  },
  components: {},
  mounted() {
    this.query(1, null)
  },
  methods: {
    query(pageNum: number, pageSize: number | null) {
      this.table.pageInfo.pageNum = pageNum
      if (pageSize != null) {
        this.table.pageInfo.pageSize = pageSize
      }
      let data = {
        sourceName: this.sourceName,
        environment: this.environment,
        pageSize: this.table.pageInfo.pageSize,
        pageNum: pageNum,
      }
      if (!data.environment || data.environment === '') {
        ElMessage.error('参数缺失!')
        return;
      }
      http('post', '/api/dataSource/query', data).then(body => {
        console.log(body)
        this.tableData = body.data
        this.table.pageInfo.total = body.pageInfo.total
      }).catch(err => {
        ElMessage.error(err.message)
      })
    },
    Timeformatter(row: DataSource){
        return moment(row.gmtCreate).format(
                "YYYY/MM/DD HH:mm:ss"
              );
    },
    handleCurrentChange(pageNum: number) {
      this.query(pageNum, null)
    },
    handleSizeChange(pageSize: number) {
      this.query(1, pageSize)
    },
    downFile(row: DataSource) {
      if (!row.sql || row.sql == '') {
        ElMessage.error("内容为空")
      } else
        this.funDownload(row.sql, row.sourceName + '.sql')
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
    copySql(a: DataSource) {
      console.log(a)
      // 获取需要复制的元素以及元素内的文本内容
      const text = a.sql
      if (text) {
        // 添加一个input元素放置需要的文本内容
        const copyContent = document.createElement('textarea');
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
      }
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