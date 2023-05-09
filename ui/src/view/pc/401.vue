<template>
  <div>
    <div>401</div>
    <router-view />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  setup() {
    return {};
  },
  components: {

  },
  methods: {
    to(path: string) {
      this.$router.push({ path });
    },
  },
  mounted() {
    console.log("=================>401");
    // this.$router.push({ path:"",redirect:"http://localhost:8080/config/redirect?url="+"http://localhost:9095/"});
    // window.open("http://localhost:8080/config/redirect?url=" + "http://localhost:9095/")
  },
  beforeCreate() {

  },
});
</script>

<style scoped>
#components-layout-demo-top-side .logo {
  text-align: left;
  line-height: 25px;
  width: 120px;
  height: 31px;
  /* background: rgba(255, 255, 255, 0.2); */
  margin: 16px 28px 16px 0;
  float: left;
}
#components-layout-demo-top-side .logo img {
  width: 31px;
  height: 31px;
}

#components-layout-demo-top-side .logo span {
  font-size: 40px;
  color: aquamarine;
}
#components-layout-demo-top-side .userInfo {
  position: absolute;
  text-align: left;
  line-height: 25px;
  width: 120px;
  height: 31px;
  /* background: rgba(255, 255, 255, 0.2); */
  margin: 16px 28px 16px 0;
  right: 5px;
}

#nickName {
  font-size: 16px;
  color: aquamarine;
}
</style>