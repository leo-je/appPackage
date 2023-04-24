<template>
    <div class="app-container">
        <button @click="toggleSidebar">Toggle Sidebar</button>
        <el-container>
            <el-aside :width="sidebarWidth" :class="{ 'is-collapse': sidebarCollapse }">
                <div>123</div>
            </el-aside>
            <el-main>
                <router-view />
            </el-main>
        </el-container>
    </div>
</template>
  
<script>
export default {
    data() {
        return {
            sidebarWidth: '200px',
            sidebarCollapse: false,
        };
    },
    methods: {
        toggleSidebar() {
            this.sidebarCollapse = !this.sidebarCollapse;
        },
    },
};
</script>
<style lang="scss">
@media (max-width: 768px) {
    .app-container .el-aside {
        width: 0;
        display: none;
    }

    .app-container .el-main {
        margin-left: 0;
    }

    .app-container .el-aside.is-collapse {
        display: block;
        position: fixed;
        top: 0;
        left: 0;
        z-index: 9999;
        height: 100%;
        overflow-y: auto;
        box-shadow: rgba(0, 0, 0, 0.5) 0 0 10px;
    }
}

@media (min-width: 769px) {
    .app-container .el-aside {
        width: 200px;
        display: block;
    }

    .app-container .el-main {
        margin-left: 200px;
    }

    .app-container .el-aside.is-collapse {
        width: 80%;
    }
}</style>  