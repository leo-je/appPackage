<template>
  <div class="common-layout" style="height: inherit;">
    <el-container style="height: 100% ;overflow: hidden">
      <el-header>mb dev tool</el-header>
      <el-container style="height: calc(100% - 100px);width:100%;">
        <el-container id="left-aside">
          <el-aside :width="isCollapse ? '20px' : '200px'" style="background-color: rgb(238, 241, 246)">
            <div class="toggle-button" @click="toggleCollapse" style="line-height: 20px;">|||</div>
            <el-menu :default-active="activeIndex" @select="handleSelect" :router="true" >
              <el-sub-menu index="1">
                <template #title><i class="el-icon-message"></i>导航一</template>
                <el-menu-item index="/mb/appPackage">APP打包</el-menu-item>
              </el-sub-menu>
            </el-menu>
          </el-aside>
        </el-container>
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
      menuIsCollapse: ref(true),
      isCollapse: ref(true),
      activeIndex: ref('/mb/appPackage'),
    };
  },
  components: {},
  mounted() {
    // this.activeIndex = this.$route.path
    // this.$route.path = '/appPackage'
    this.$router.push({path: this.activeIndex})
  },
  methods: {
    toggleCollapse() {
      this.isCollapse = !this.isCollapse
      if (this.isCollapse) {
        this.activeIndex = ""
      }
    },
    handleSelect() {
      console.log(this.activeIndex)
      this.$route.path = this.activeIndex
    }
  },
  beforeCreate() {
    console.log(this.$route.path)
    console.log("md-index");
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
  z-index: 101;
}

#left-aside{
  z-index: 100;
  position: absolute;
  height: 85%;
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
  // line-height: 160px;
  height: 100%;
  width: 100%;
}

.el-container>:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
  line-height: 260px;
}

.el-container>:nth-child(7) .el-aside {
  line-height: 320px;
}
</style>