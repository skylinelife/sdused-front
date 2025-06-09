<script setup lang="ts">
import { LikeOutlined } from '@ant-design/icons-vue';
import { userInfoStore } from "@/stores/user.ts";
import { onMounted, ref } from "vue";
import { articleRecommend } from "@/api/user";

interface simpleArticle {
  article_id: number;
  article_name: string;
  user_name: string;
  article_content: string;
  useful_num: number;
  publish_date: string;
}

const listData = ref<simpleArticle[]>([]);

const fetchArticles = async () => {
  try {
    const res = await articleRecommend();
    console.log(res);
    listData.value = res || [];
  } catch (err) {
    alert("文章列表出错");
    console.log(err);
  }
};

onMounted(() => {
  fetchArticles();
});

const userStore = userInfoStore();

const pagination = {
  onChange: (page: number) => {
    console.log(page);
  },
  pageSize: 5,
};
</script>

<template>
<div class="container">
  <div class="article-list">
    <a-list
        item-layout="vertical"
        size="large"
        :pagination="pagination"
        :data-source="listData"
    >
      <!--      <template #footer>-->
      <!--        <div class="footer-tip">-->
      <!--          <b>已经到底了哦~</b>-->
      <!--        </div>-->
      <!--      </template>-->

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
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  padding: 40px 16px;
  background-color: #f0f2f5;
  gap: 30px;
  background-image: url("/src/assets/recommend.png");
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
}

.article-list {
  width: 70%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 30px;
  background-color: rgba(249, 249, 249, 0.9);
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
}

.footer-tip {
  text-align: center;
  color: #888;
  margin-top: 16px;
}

.article-card {
  margin-bottom: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: box-shadow 0.3s;
  padding: 16px;
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
  font-size: 22px;
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
</style>
