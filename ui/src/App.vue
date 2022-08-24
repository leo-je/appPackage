<template>
  <router-view />
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: 'App',
  components: {
  },
  mounted() {
  },
  beforeCreate() {
    let pathname = window.location.pathname
    let token = sessionStorage.getItem("access-user")
    if (!token) {
      this.$router.push({ path: "/login" });
    } else
      this.$router.push({ path: pathname || "/" });
  }
})
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  /* margin-top: 60px; */
}

html,
body,
#app,
.el-container {
  margin: 0;
  padding: 0;
  height: 100%;
}
</style>
