<script setup lang="ts">
import { reactive, ref, watch } from "vue";
import {useRouter} from "vue-router";
import {login} from "../api/user.ts"
import {userInfoStore} from "@/stores/user.ts";


const router=useRouter();
const userStore=userInfoStore();
const formState = reactive({
  user_name: '',
  password: '',
  remember: false,
});
console.log(userStore.userInfo.user_name);
// 添加记住密码功能的处理逻辑
// watch(
//   () => formState.remember,
//   (newValue) => {
//     if (newValue) {
//       localStorage.setItem('remember', JSON.stringify(formState));
//     } else {
//       localStorage.removeItem('remember');
//     }
//   }
// );

// 在组件挂载时尝试从localStorage中恢复状态
if (localStorage.getItem('remember')) {
  Object.assign(formState, JSON.parse(localStorage.getItem('remember') || '{}'));
}

const handleSubmit = async () =>  {
  if(formState.remember) {
    localStorage.setItem('remember', JSON.stringify(formState));
  }else {
    localStorage.removeItem('remember');
  }
  const data = {
    account_number: 1,
    user_name: formState.user_name,
    password: formState.password,
  };
  console.log("loginMessage",formState);
  try{
    const res = await login(data);
    console.log(res);
    if(res.data.message === "Login successful"){
      userStore.setUserInfo(res.data.user_name);
        //TODO
      console.log(userStore.userInfo.user_name);
      if(userStore.isLogin===true) {
        router.push('/recommend');
      }
    }
    else{
      console.log('error');
    }

  }catch(err){
    console.log(err)
  }
};
</script>

<template>
  <div class="container">
    <a-form
        class="login-form"
        :model="formState"
        name="basic"
        :label-col="{ span: 8 }"
        :wrapper-col="{ span: 16 }"
        autocomplete="off"
        @finish="handleSubmit"
    >
      <h1 class="title">登录</h1>
      <p class="description">欢迎使用我们的服务！</p>
      <a-form-item
          class="input"
          label="用户名"
          name="user_name"
          :rules="[{ required: true, message: '请输入您的用户名！' }]"
      >
        <a-input v-model:value="formState.user_name" placeholder="请输入用户名" />
      </a-form-item>

      <a-form-item
          class="input"
          label="密码"
          name="password"
          :rules="[{ required: true, message: '请输入您的密码！' }]"
      >
        <a-input-password v-model:value="formState.password" placeholder="请输入密码" />
      </a-form-item>

      <a-form-item name="remember" :wrapper-col="{ offset: 7, span: 10 }">
        <a-checkbox v-model:checked="formState.remember">记住密码</a-checkbox>
      </a-form-item>

      <a-form-item :wrapper-col="{ offset: 7, span: 10 }">
        <a-button class="ant-btn" type="primary" html-type="submit">登录</a-button>
      </a-form-item>
      <a-form-item :wrapper-col="{ offset: 7, span: 10 }">
        <span>还没有账号？
          <router-link to="/register" style="color: #1890ff;">去注册</router-link>
        </span>
      </a-form-item>
      <a-form-item :wrapper-col="{ offset: 7, span: 10 }">
        <span>或者
          <router-link to="/recommend" style="color: #1890ff;">游客访问</router-link>
        </span>
      </a-form-item>
    </a-form>


  </div>
</template>

<style scoped>
body {
  margin: auto;
  padding: 0;
  width: 100%;
  height: 100%;
}

.container {
  position:absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background-color: #f0f2f5;
}

.login-form {
  width: 100%;
  max-width: 500px;
  padding: 2.5rem;
  background-color: #ffff;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); /* 增强阴影 */
  margin-top: 250px;
  margin-left: auto;
  margin-right: auto;
}

.title {
  font-size: 2rem;
  text-align: center;
  color: #1890ff;
  margin-bottom: 1rem;
}

.description {
  text-align: center;
  color: #666;
  margin-bottom: 2rem;
}

.input{
  margin-left: 1rem;
  margin-bottom: 0.5rem;
  max-width: 350px;
}

.ant-form-item {
  margin-bottom: 1.5rem;
}

.ant-btn {
  width: 100%;
  margin-top: -1rem;
}

</style>
