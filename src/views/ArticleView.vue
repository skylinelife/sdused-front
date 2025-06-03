<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getArticleDetail } from "@/api/manager.ts";
import { Card, Typography, Spin, Alert } from 'ant-design-vue';

const articleId = 1; // 假设文章 ID 为 1，可根据路由参数动态传入

const loading = ref(true);
const error = ref<string | null>(null);
const article = ref<{ title: string; author: string; content: string } | null>(null);

onMounted(async () => {
  try {
    const res = await getArticleDetail(articleId);
    article.value = res.data;
  } catch (err) {
    error.value = '文章加载失败';
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <Spin :spinning="loading">
    <template v-if="error">
      <Alert type="error" :message="error" show-icon />
    </template>
    <template v-else-if="article">
      <Card :title="article.title" bordered>
        <template #extra>
          <span>作者：{{ article.author }}</span>
        </template>
        <Typography.Paragraph style="white-space: pre-wrap;">
          {{ article.content }}
        </Typography.Paragraph>
      </Card>
    </template>
  </Spin>
</template>

<style scoped>
</style>
