
<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像区域 -->
      <div class="avatar_box">
        <img src="../../assets/logo.png" />
      </div>
      <!-- 登录表单区域 -->
      <el-form label-width="0px" class="login_form">
        <!-- 用户名 -->
        <el-form-item>
          <el-input v-model="username" placeholder="Please input username"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item>
          <el-input v-model="password" placeholder="Please input password" show-password></el-input>
        </el-form-item>
        <!-- 按钮区域 -->
        <el-row justify="end">
          <el-form-item class="login_btn">
            <el-button type="primary" @click="login">登录</el-button>
            <el-button type="info" @click="reset">重置</el-button>
          </el-form-item>
        </el-row>
      </el-form>
    </div>
  </div>
</template>


<script lang="ts">
import { ElMessage } from 'element-plus';
import { defineComponent, ref } from 'vue';
import http from "../../utils/http";

export default defineComponent({
  setup() {
    return {
      username: ref(''),
      password: ref(''),
    };
  },
  components: {

  },
  methods: {
    to(path: string) {
      this.$router.push({ path });
    },
    login() {
      let _this = this;
      let data = {
        client_id: 'app',
        username: this.username,
        password: this.password,
        redirect_uri: 'login',
        redirect: '/'
      }
      http('post', '/oauth/login', data).then(function (data) {
        console.log(data)
        if (data.code == '0000') {
          sessionStorage.setItem('access-user',data.token)
          ElMessage('登陆成功')
          _this.to("/")
        }

      })
    },
    reset() {
      this.username = ''
      this.password = ''
    }
  },
  mounted() {
    console.log("=================>login");
    var query = this.$route.query;
    let token = query.token;
    if (!token) {

    } else {
      this.to("/")
    }
    // this.$router.push({ path:"",redirect:"http://localhost:8080/config/redirect?url="+"http://localhost:9095/"});
    // window.open("http://localhost:8080/config/redirect?url=" + "http://localhost:9095/")
  },
  beforeCreate() {

  },
});
</script>

<style lang="less" scoped>
.login_container {
  background-color: #2b4b6b;
  height: 100vh;
}
.login_box {
  // 宽450像素
  width: 90%;
  // 高300像素
  height: 300px;
  // 背景颜色
  background-color: #fff;
  // 圆角边框3像素
  border-radius: 3px;
  // 绝对定位
  position: absolute;
  // 距离左则50%
  left: 50%;
  // 上面距离50%
  top: 50%;
  // 进行位移，并且在横轴上位移-50%，纵轴也位移-50%
  transform: translate(-50%, -50%);
  .avatar_box {
    // 盒子高度130像素
    height: 130px;
    // 宽度130像素
    width: 130px;
    // 边框线1像素 实线
    border: 1px solid #eee;
    // 圆角
    border-radius: 50%;
    // 内padding
    padding: 10px;
    // 添加阴影 向外扩散10像素 颜色ddd
    box-shadow: 0 0 10px #ddd;
    // 绝对定位
    position: absolute;
    // 距离左则
    left: 50%;
    // 位移
    transform: translate(-50%, -50%);
    // 背景
    background-color: #fff;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }
}
.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}
.login_btn {
  // 设置弹性布局
  display: flex;
  // 横轴上尾部对齐
  justify-content: flex-end;
}
</style>