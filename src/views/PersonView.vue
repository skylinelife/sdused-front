<script setup lang="ts">
import { LikeOutlined } from '@ant-design/icons-vue';
import { useRouter } from 'vue-router';
import { userInfoStore } from '@/stores/user.ts';
import { onMounted, ref } from 'vue';
import { articleMy, updateUserInfo, getUserInfo,uploadAvatar, updatePassword } from '@/api/user';
import { reactive } from 'vue';
import { message } from 'ant-design-vue';

const isModalVisible = ref(false);

const editForm = reactive({
  user_email: '',
  password: '',
  confirmPassword: '',
  sex: '',
  avatarBase64:'',
});

const isPasswordModalVisible = ref(false);
const passwordForm = reactive({
  password: '',
  confirmPassword: ''
});

const openPasswordModal = () => {
  passwordForm.password = '';
  passwordForm.confirmPassword = '';
  isPasswordModalVisible.value = true;
};

const handlePasswordOk = async () => {
  if (passwordForm.password !== passwordForm.confirmPassword) {
    message.error('两次输入的密码不一致');
    return;
  }

  if (!validatePassword(passwordForm.password)) {
    message.error('密码必须为6-20位，且至少包含大写、小写、数字、特殊字符中的三种');
    return;
  }

  const data = {
    user_name: store.userInfo.user_name,
    password: passwordForm.password
  };

  try {
    await updatePassword(data);
    message.success('密码更新成功');
    isPasswordModalVisible.value = false;
  } catch (err) {
    console.error('更新密码失败', err);
    message.error('密码更新失败，请稍后再试');
  }
};

const handlePasswordCancel = () => {
  isPasswordModalVisible.value = false;
};


const validatePassword = (password: string) => {
  const rules = [
    /[A-Z]/,       // 大写字母
    /[a-z]/,       // 小写字母
    /[0-9]/,       // 数字
    /[^A-Za-z0-9]/ // 特殊字符
  ];
  const passedRules = rules.filter((rule) => rule.test(password)).length;
  return password.length >= 6 && password.length <= 20 && passedRules >= 3;
};

const isAvatarModalVisible = ref(false);

const openAvatarModal = () => {
  isAvatarModalVisible.value = true;
};

const handleAvatarUpload = async () => {
  if (!editForm.avatarBase64) {
    message.error('请先选择头像图片');
    return;
  }

  try {
    const data = {
      user_name: store.userInfo.user_name,
      icon: editForm.avatarBase64,
    };
    await uploadAvatar(data);
    message.success('头像上传成功');
    isAvatarModalVisible.value = false;

    // 更新头像
    refreshUserInfo();
  } catch (err) {
    console.error('头像上传失败', err);
    message.error('头像上传失败，请稍后重试');
  }
};


const handleAvatarCancel = () => {
  isAvatarModalVisible.value = false;
};

const beforeAvatarUpload = (file: File) => {
  const reader = new FileReader();
  reader.onload = () => {
    editForm.avatarBase64 = reader.result as string;
  };
  reader.readAsDataURL(file);
  return false; // 阻止自动上传
};


const openEditModal = () => {
  editForm.user_email = store.userInfo.userEmail || '';
  editForm.sex=store.userInfo.userSex||'男';
  isModalVisible.value = true;
};

const handleOk = async () => {

  const data = {
    user_name: store.userInfo.user_name,
    email: editForm.user_email,
    sex: editForm.sex
  };

  try {
    await updateUserInfo(data);
    store.userInfo.userEmail = editForm.user_email;
    message.success('信息已成功更新');
    isModalVisible.value = false;
    store.userInfo.userSex= editForm.sex;
  } catch (error) {
    console.error('更新失败：', error);
    message.error('更新失败，请稍后重试');
  }
};

const handleCancel = () => {
  isModalVisible.value = false;
};



interface simpleArticle {
  article_id: number;
  article_name: string;
  user_name: string;
  article_content: string;
  useful_num: number;
  publish_date: string;
}

const router = useRouter();
const store = userInfoStore();
const listData = ref<simpleArticle[]>([]);

const refreshUserInfo = async () => {
  const params={
    user_name: store.userInfo.user_name,
  }
  try {
    const res = await getUserInfo(params);
    if (res) {
      store.userInfo.userEmail = res.email;
      store.userInfo.userSex = res.sex;
      store.userInfo.userArticle_num=res.article_num;
      store.userInfo.userComment_num=res.comment_num;
      store.userInfo.userAvatar=res.icon;
    }
  } catch (err) {
    console.error('获取用户信息失败：', err);
    message.error('无法加载用户信息，请稍后再试');
  }
};

// 如果未登录，跳转到登录页面
onMounted(() => {
  if (!store.isLogin) {
    alert('请先登录。');
    router.push('/login');
  } else {
    refreshUserInfo();
    fetchArticles();
  }
});

const fetchArticles = async () => {
  try {
    const params={
      user_name: store.userInfo.user_name,
    }
    console.log(params);
    const res = await articleMy(params);
    console.log(res);
    listData.value = res || [];
  } catch (err) {
    alert('文章列表出错');
    console.error(err);
  }
};

const pagination = {
  onChange: (page: number) => {
    console.log(page);
  },
  pageSize: 5,
};
</script>

<template>
  <div class="profile-container">
    <div class="panel">
      <a-card class="profile-card" title="个人中心">
        <template #extra>
          <a-button type="link" @click="openPasswordModal">修改密码</a-button>
          <a-button type="link" @click="openEditModal">修改信息</a-button>
          <a-button type="link" @click="openAvatarModal">上传头像</a-button>
        </template>
        <a-modal
            v-model:open="isPasswordModalVisible"
            title="修改密码"
            @ok="handlePasswordOk"
            @cancel="handlePasswordCancel"
        >
          <a-form layout="vertical">
            <a-form-item label="新密码">
              <a-input-password v-model:value="passwordForm.password" placeholder="请输入新密码" />
            </a-form-item>
            <a-form-item label="确认密码">
              <a-input-password v-model:value="passwordForm.confirmPassword" placeholder="请再次输入密码" />
            </a-form-item>
          </a-form>
        </a-modal>


        <a-modal
            v-model:open="isAvatarModalVisible"
            title="上传头像"
            @cancel="handleAvatarCancel"
            footer=""
        >
          <a-upload
              :before-upload="beforeAvatarUpload"
              :show-upload-list="false"
              accept="image/*"
          >
            <a-button>选择图片</a-button>
          </a-upload>

          <div v-if="editForm.avatarBase64" style="margin-top: 16px;">
            <p>头像预览：</p>
            <img
                :src="editForm.avatarBase64"
                alt="头像预览"
                style="width: 100px; height: 100px; object-fit: cover; border-radius: 50%;"
            />
            <div style="margin-top: 16px; text-align: right;">
              <a-button type="primary" @click="handleAvatarUpload">确认上传</a-button>
            </div>
          </div>
        </a-modal>



        <a-modal
            v-model:open="isModalVisible"
            title="修改个人信息"
            @ok="handleOk"
            @cancel="handleCancel"
        >
          <a-form layout="vertical">
            <a-form-item label="邮箱">
              <a-input v-model:value="editForm.user_email" placeholder="请输入邮箱" />
            </a-form-item>
            <a-form-item label="性别">
              <a-select v-model:value="editForm.sex" placeholder="请选择性别">
                <a-select-option value="男">男</a-select-option>
                <a-select-option value="女">女</a-select-option>
                <a-select-option value="保密">保密</a-select-option>
              </a-select>
            </a-form-item>
          </a-form>
        </a-modal>



        <div class="avatar-wrapper avatar-horizontal">
          <a-avatar shape="circle" size="large" :src="store.userInfo.userAvatar||'https://joeschmoe.io/api/v1/random'" />
          <div class="username">{{ store.userInfo.user_name }}</div>
        </div>

        <a-descriptions bordered :column="2" layout="horizontal" size="middle" class="descriptions">
          <a-descriptions-item label="邮箱">
            {{ store.userInfo.userEmail || "未绑定" }}
          </a-descriptions-item>
          <a-descriptions-item label="性别">
            {{ store.userInfo.userSex || "保密" }}
          </a-descriptions-item>
          <a-descriptions-item label="发表文章数">
            {{ store.userInfo.userArticle_num || 0 }}
          </a-descriptions-item>
          <a-descriptions-item label="评论数量">
            {{ store.userInfo.userComment_num || 0 }}
          </a-descriptions-item>
        </a-descriptions>
      </a-card>
    </div>

    <!-- 文章列表 -->
    <div class="panel">
      <header class="article-header">
        <h2>我的文章</h2>
        <a-button type="primary" @click="router.push('/createArticle')">创建文章</a-button>
      </header>


      <a-list
          item-layout="vertical"
          size="large"
          :pagination="pagination"
          :data-source="listData"
      >

        <template #renderItem="{ item }">
          <a-card class="article-card" hoverable :key="item.article_id">
            <div class="card-header">
              <a class="article-title" :href="`/article/${item.article_id}`">
                {{ item.article_name }}
              </a>
              <span class="like-info">
                <LikeOutlined style="color: #f5222d; margin-right: 4px" />
                {{ item.useful_num }}
              </span>
            </div>
            <div class="article-meta">
              <span class="author">作者：{{ item.user_name }}</span>
              <span class="date">
                发布日期：{{ new Date(item.publish_date).toLocaleDateString() }}
              </span>
            </div>
          </a-card>
        </template>
      </a-list>
    </div>
  </div>
</template>

<style scoped>
.profile-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  padding: 60px 16px;
  background-color: #f0f2f5;
  gap: 40px;
  background-image: url("/src/assets/background.png");
  background-size: 100% 100%;
  background-attachment: fixed;
}

.panel {
  width: 100%;
  min-width: 400px;
  max-width: 1200px;
  background-color: #e0e0e0;
}

.profile-card {
  width: 100%;
  padding: 24px;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.avatar-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 24px;
}

.avatar-horizontal {
  flex-direction: row;
  justify-content: flex-start;
  gap: 16px;
}

.avatar-horizontal .username {
  margin-top: 0;
  align-self: center;
  font-size: 20px;
  font-weight: bold;
  color: #1890ff;
}

.username {
  margin-top: 12px;
  font-size: 20px;
  font-weight: bold;
  color: #1890ff;
}

.descriptions {
  margin-top: 20px;
}

.article-card {
  margin-bottom: 16px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: box-shadow 0.3s;
  background: #fff;
}

.article-card:hover {
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.article-title {
  font-size: 20px;
  font-weight: bold;
  color: #1890ff;
  text-decoration: none;
}

.article-title:hover {
  text-decoration: underline;
}

.like-info {
  font-size: 16px;
  display: flex;
  align-items: center;
  color: #f5222d;
}

.article-meta {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: #888;
  padding-top: 8px;
  border-top: 1px solid #eee;
}

.author {
  font-weight: 500;
}

.date {
  font-style: italic;
}
.article-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding: 0 8px;
}


</style>
