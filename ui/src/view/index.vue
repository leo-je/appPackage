<template>
  <div class="common-layout" style="height: inherit;">
    <el-container style="height: 100% ;overflow: hidden">
      <el-header>dev tool</el-header>
      <el-container style="height: calc(100% - 100px);width:100%;">
        <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
          <el-menu :default-active="activeIndex" @select="handleSelect" :router="true">
            <el-sub-menu index="1">
              <template #title><i class="el-icon-message"></i>导航一</template>
              <el-menu-item index="/appPackage">APP打包</el-menu-item>
              <el-menu-item index="/exportProcess">流程导出</el-menu-item>
            </el-sub-menu>
          </el-menu>
        </el-aside>
        <el-container>
            <el-main class="index-main" style="overflow: auto;">
                <router-view />
            </el-main>
        </el-container>
      </el-container>
      <el-footer>...</el-footer>
    </el-container>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
export default defineComponent({
  setup() {
    return {
      activeIndex: ref('/appPackage'),
    };
  },
  components: {},
  mounted() {
    // this.activeIndex = this.$route.path
  },
  methods: {
    handleSelect() {
      console.log(this.activeIndex)
      this.$route.path = this.activeIndex
    }
  },
  beforeCreate() {
    console.log(this.$route.path)
    console.log("index");
  }
});
</script>


<style lang="scss" scoped>
.el-header,
.el-footer {
  background-color: #f40f0f94;
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

.index-main {
  background-color: #e9eef3;
  color: var(--el-text-color-primary);
  text-align: center;
  line-height: 160px;
  height: 100%;
  width: 100%;
}

body>.el-container> {
  margin-bottom: 40px;
}

.el-container>:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
  line-height: 260px;
}

.el-container>:nth-child(7) .el-aside {
  line-height: 320px;
}
</style>