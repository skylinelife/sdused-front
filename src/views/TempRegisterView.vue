<script setup lang="ts">
import {reactive, ref, watch} from "vue";
import request from '../utils/axios.ts';
import {register} from "@/api/user.ts";
import {useRouter} from "vue-router";

const formState = reactive(
    {
      user_name: '',
      password: '',
      confirmPassword: '',
      user_email: '',
      passwordError: '',
      confirmPasswordError: '',
    }
)
const router=useRouter();
const validatePassword = (password: string) => {
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[^A-Za-z0-9]/.test(password);

  const validConditions = [hasUpperCase, hasLowerCase, hasNumber, hasSpecialChar].filter(Boolean).length;
  return validConditions >= 3;
};

watch(() => formState.password,
    (newpassWord) => {
      if (!validatePassword(newpassWord)) {
        formState.passwordError = '密码必须包含大写字母、数字、小写字母、特殊符号中的至少三种。';
      } else if (newpassWord.length < 6 || newpassWord.length > 20) {
        formState.passwordError = '密码应为6-20位。';
      } else {
        formState.passwordError = '';
      }
    })

watch(() => [formState.password, formState.confirmPassword],
    ([newPassword, newConfirmPassword]) => {
      if (newPassword !== newConfirmPassword) {
        formState.confirmPasswordError = '两次密码输入不一致。';
      } else {
        formState.confirmPasswordError = '';
      }
    })
const handleSubmit = async () => {
  if (formState.passwordError) {
    console.log("Wrong");
    alert("密码必须包含大写字母、数字、小写字母、特殊符号中的至少三种。并且在6-20位之间")
    return;
  }
  else if(formState.confirmPasswordError) {
    alert("两次密码输入不一致。");
    return;
  }
  else{
    const data = {
      user_name: formState.user_name,
      password: formState.password,
      //sex: 'a',
      email: formState.user_email,
      //authority: 1,
    };

    try {

      const userdata = await register(data);
      //console.log(userdata.data);
      alert('注册成功！请登录。');

      router.push('/login');

    } catch (error) {
      alert('注册失败，请稍后重试。');
      console.error(error);
    }
  }
  // 继续处理表单提交
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
      <h1 class="title">注册</h1>
      <p class="description">欢迎</p>
      <a-form-item
          class="input"
          label="用户名"
          name="user_name"
          :rules="[{ required: true, message: '请输入您的用户名！' }]"
      >
        <a-input v-model:value="formState.user_name" placeholder="请输入用户名"/>
      </a-form-item>
      <a-form-item
          class="input"
          label="邮箱"
          name="user_email"
          :rules="[{required:true, message:'请输入您的邮箱!'}]"
      >
        <a-input v-model:value="formState.user_email" placeholder="请输入邮箱"/>
      </a-form-item>
      <a-form-item
          class="input"
          label="密码"
          name="password"
          :rules="[{ required: true, message: '请输入您的密码！' }]"
      >
        <a-input-password v-model:value="formState.password" placeholder="请输入密码"/>
      </a-form-item>
      <a-form-item
          class="input"
          label="确认密码"
          name="confirmPassword"
          :rules="[{required: true,message:'请再次输入您的密码！'}]"
      >
        <a-input-password v-model:value="formState.confirmPassword" placeholder="请再次输入密码"/>
      </a-form-item>
      <a-form-item :wrapper-col="{ offset: 7, span: 10 }">
        <a-button class="ant-btn" type="primary" html-type="submit" >注册</a-button>
      </a-form-item>
      <a-form-item :wrapper-col="{ offset: 7, span: 10 }">
        <span>已有账号？
          <router-link to="/login" style="color: #1890ff;">去登录</router-link>
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
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
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