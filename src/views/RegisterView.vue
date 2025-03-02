<script setup lang="ts">
import {ref, watch} from "vue";

const userName = ref('');
const password = ref('');
const confirmPassword = ref('');
const userPhone = ref('');
const passwordError = ref('');
const confirmPasswordError = ref('');
const confirmPasswordTouched = ref(false);

const validatePassword = (password: string) => {
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const validConditions = [hasUpperCase, hasLowerCase, hasNumber, hasSpecialChar].filter(Boolean).length;
  return validConditions >= 3;
};

watch(password, (newPassword) => {
  if (!validatePassword(newPassword)) {
    passwordError.value = '密码必须包含大写字母、数字、小写字母、特殊符号中的至少三种。';
  } else {
    passwordError.value = '';
  }
});

watch([password, confirmPassword], ([newPassword, newConfirmPassword]) => {
  if (newPassword !== newConfirmPassword) {
    confirmPasswordError.value = '两次密码输入不一致。';
  } else {
    confirmPasswordError.value = '';
  }
});

const handleSubmit = () => {
  if (passwordError.value || confirmPasswordError.value) {
    // 如果有错误，不提交表单
    return;
  }
  // 继续处理表单提交
};
</script>

<template>
  <div class="registerPage">
    <div class="registerContainer">
      <div class="FormHeader">
        <h2>创建账号</h2>
        <p>布劳阁欢迎您！</p>
      </div>
      <form class="form" @submit.prevent="handleSubmit">
        <div class="input">
          <input type="text" id="userName" v-model="userName" required maxlength="20"/>
          <label for="userName">用户名</label>
          <span class="highlight"></span>
        </div>
        <div class="input">
          <input type="text" id="userPhone" v-model="userPhone" required/>
          <label for="userPhone">联系电话</label>
          <span class="highlight"></span>
        </div>
        <div class="input">
          <input type="password" id="password" v-model="password" required minlength="6" maxlength="20"/>
          <label for="password">密码</label>
          <span class="highlight"></span>
        </div>
        <div v-if="passwordError" class="error">{{ passwordError }}</div>
        <div class="input">
          <input type="password" id="confirmPassword" v-model="confirmPassword" required minlength="6" maxlength="20"/>
          <label for="confirmPassword">确认密码</label>
          <span class="highlight"></span>
        </div>
        <div v-show="confirmPasswordTouched" v-if="confirmPasswordError" class="error">{{ confirmPasswordError }}</div>
        <button type="submit" class="submit-btn">注册</button>
        <div class="form-footer">
          <span>已有账号？</span>
          <a href="/login">立即登录</a>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.registerPage {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #0a0a0b 0%, #444855 100%);
  padding: 20px;
}

.registerContainer {
  width: 100%;
  max-width: 480px;
  background: white;
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
}

.FormHeader {
  text-align: center;
  margin-bottom: 40px;
}

.FormHeader h2 {
  color: #2c3e50;
  font-size: 32px;
  margin-bottom: 5px;
  font-weight: 700;
}

.FormHeader p {
  color: #1b615b;
  font-size: 16px;
}


.form .input {
  position: relative;
  margin-bottom: 30px;
}

.input input {
  width: 100%;
  padding: 15px;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  font-size: 16px;
  transition: all 0.3s ease;
  background: transparent;
}

.input label {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  background: white;
  padding: 0 5px;
  color: #95a5a6;
  font-size: 16px;
  transition: all 0.3s ease;
  pointer-events: none;
}

.input input:focus,
.input input:valid {
  border-color: #3498db;
}

.input input:focus + label,
.input input:valid + label {
  top: 0;
  font-size: 14px;
  color: #3498db;
}

.submit-btn {
  width: 100%;
  padding: 15px;
  background: linear-gradient(to right, #3498db, #2980b9);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(52, 152, 219, 0.3);
}


.form-footer {
  text-align: center;
  margin-top: 20px;
  color: #95a5a6;
}

.form-footer a {
  color: #3498db;
  text-decoration: none;
  margin-left: 5px;
  font-weight: 600;
}

.form-footer a:hover {
  text-decoration: underline;
}

.error {
  font-size: 13px;
  color: red;
  margin-top: -20px;
  margin-bottom: 10px;
}

@media (max-width: 480px) {
  .registerPage {
    padding: 20px;
  }

  .FormHeader h2 {
    font-size: 24px;
  }

  .input input {
    padding: 12px;
  }
}

@media (max-width: 768px) {
  .registerPage {
    max-width: 400px;
    padding: 30px;
  }

  .FormHeader h2 {
    font-size: 28px;
  }

  .FormHeader p {
    font-size: 14px;
  }
}

@media (max-width: 480px) {
  .registerPage {
    padding: 20px;
    margin: 10px;
    max-width: 100%;
  }

  .FormHeader h2 {
    font-size: 24px;
  }

  .FormHeader p {
    font-size: 14px;
  }

  .input input {
    padding: 12px;
    font-size: 14px;
  }

  .input label {
    font-size: 14px;
  }

  .submit-btn {
    padding: 12px;
    font-size: 16px;
  }
}

@media (max-width: 320px) {
  .registerPage {
    padding: 15px;
  }

  .FormHeader h2 {
    font-size: 20px;
  }

  .input {
    margin-bottom: 20px;
  }
}
</style>