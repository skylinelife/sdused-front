<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { message } from 'ant-design-vue';
import { articleCreate } from '@/api/user.ts';
import { userInfoStore } from '@/stores/user.ts';

const router = useRouter();
const store = userInfoStore();

const title = ref('');
const content = ref('');

const isSubmitting = ref(false);

const submitArticle = async () => {
  if (!title.value.trim() || !content.value.trim()) {
    message.warning('标题和内容不能为空');
    return;
  }

  const data = {
    user_name: store.userInfo.user_name,
    article_name: title.value,
    article_content: content.value,
  };

  isSubmitting.value = true;

  try {
    const res=await articleCreate(data);
    message.success('文章创建成功');
    router.push('/'); // 创建成功后跳转首页或文章列表
  } catch (err) {
    console.error(err);
    message.error('文章创建失败');
  } finally {
    isSubmitting.value = false;
  }
};

onMounted(() => {
  if (!store.isLogin) {
    alert('请先登录。');
    router.push('/login');
  }
});
</script>

<template>
  <div class="article-create-container">
    <a-card class="article-card">
      <h1 class="article-title">发布新文章</h1>

      <a-input
          v-model:value="title"
          placeholder="请输入文章标题"
          class="article-input"
      />

      <a-textarea
          v-model:value="content"
          :auto-size="{ minRows: 8 }"
          placeholder="请输入文章内容"
          class="article-textarea"
      />

      <div style="text-align: right; margin-top: 16px;">
        <a-button
            type="primary"
            @click="submitArticle"
            :loading="isSubmitting"
        >
          发布文章
        </a-button>
      </div>
    </a-card>
  </div>
</template>

<style scoped>
.article-create-container {
  display: flex;
  justify-content: center;
  padding: 40px 16px;
  background-color: #f0f2f5;
  min-height: 100vh;
}

.article-card {
  width: 100%;
  max-width: 800px;
  background: #fff;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.article-title {
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 24px;
}

.article-input {
  font-size: 16px;
  margin-bottom: 16px;
}

.article-textarea {
  font-size: 16px;
}
</style>
