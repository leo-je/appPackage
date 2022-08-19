<template>
  <div class="common-layout">
    <el-container>
      <el-header>Header</el-header>
      <el-container>
        <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
          <el-menu :default-openeds="['1', '3']">
            <el-sub-menu index="1">
              <template #title><i class="el-icon-message"></i>导航一</template>
              <!-- <el-menu-item-group> -->
                <!-- <template #title>分组一</template> -->
                <el-menu-item index="1-1">APP打包</el-menu-item>
                <el-menu-item index="1-2">流程导出</el-menu-item>
              <!-- </el-menu-item-group> -->
              <!-- <el-menu-item-group title="分组2">
                <el-menu-item index="1-3">选项3</el-menu-item>
              </el-menu-item-group> -->
              <!-- <el-sub-menu index="1-4">
                <template #title>选项4</template>
                <el-menu-item index="1-4-1">选项4-1</el-menu-item>
              </el-sub-menu> -->
            </el-sub-menu>
            <!-- <el-sub-menu index="2">
              <template #title><i class="el-icon-menu"></i>导航二</template>
              <el-menu-item-group>
                <template #title>分组一</template>
                <el-menu-item index="2-1">选项1</el-menu-item>
                <el-menu-item index="2-2">选项2</el-menu-item>
              </el-menu-item-group>
              <el-menu-item-group title="分组2">
                <el-menu-item index="2-3">选项3</el-menu-item>
              </el-menu-item-group>
              <el-sub-menu index="2-4">
                <template #title>选项4</template>
                <el-menu-item index="2-4-1">选项4-1</el-menu-item>
              </el-sub-menu>
            </el-sub-menu> -->
            <!-- <el-sub-menu index="3">
              <template #title><i class="el-icon-setting"></i>导航三</template>
              <el-menu-item-group>
                <template #title>分组一</template>
                <el-menu-item index="3-1">选项1</el-menu-item>
                <el-menu-item index="3-2">选项2</el-menu-item>
              </el-menu-item-group>
              <el-menu-item-group title="分组2">
                <el-menu-item index="3-3">选项3</el-menu-item>
              </el-menu-item-group>
              <el-sub-menu index="3-4">
                <template #title>选项4</template>
                <el-menu-item index="3-4-1">选项4-1</el-menu-item>
              </el-sub-menu>
            </el-sub-menu> -->
          </el-menu>
        </el-aside>
        <el-container>
          <el-main>
            <router-view />
          </el-main>
          <el-footer>Footer</el-footer>
        </el-container>
      </el-container>
    </el-container>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
export default defineComponent({
  setup() {
    return {

    };
  },
  components: {},
  mounted() {

  },
  methods: {
  },
  beforeCreate() {
    console.log("index");
  }
});
</script>


<style scoped>
.el-header,
.el-footer {
  background-color: #b3c0d1;
  color: var(--el-text-color-primary);
  text-align: center;
  line-height: 60px;
}

.el-aside {
  background-color: #d3dce6;
  color: var(--el-text-color-primary);
  text-align: center;
  line-height: 200px;
}

.el-main {
  background-color: #e9eef3;
  color: var(--el-text-color-primary);
  text-align: center;
  line-height: 160px;
}

body>.el-container {
  margin-bottom: 40px;
}

.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
  line-height: 260px;
}

.el-container:nth-child(7) .el-aside {
  line-height: 320px;
}
</style>