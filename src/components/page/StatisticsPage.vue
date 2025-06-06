<script setup lang="ts">
import Comment from "@/components/Comment.vue";
import {onMounted, ref} from "vue";
import {fetchArticleStatsApi, fetchTopArticlesApi, fetchUserStatsApi} from "@/api/manager.ts";

export interface UserStats {
  totalUsers: number;
  newUsers: {
    daily: number;
    weekly: number;
    monthly: number;
  };
  activeUsers: {
    dau: number;
    wau: number;
    mau: number;
  };
}

export interface ArticleStats {
  totalArticles: number;
  newArticlesToday: number;
  totalComments: number;
  totalLikes: number;
}

export interface TopArticle {
  id: string | number;
  title: string;
  likes: number;
  url?: string;
}

const userStats = ref<UserStats | null>(null);
const isLoadingUserStats = ref(true);
const userStatsError = ref<string | null>(null);

// 文章数据状态
const articleStats = ref<ArticleStats | null>(null);
const isLoadingArticleStats = ref(true);
const articleStatsError = ref<string | null>(null);

// 热门内容状态
const topArticles = ref<TopArticle[]>([]);
const isLoadingTopArticles = ref(true);
const topArticlesError = ref<string | null>(null);

// 获取用户数据
async function loadUserStats() {
  isLoadingUserStats.value = true;
  userStatsError.value = null;
  try {
    userStats.value = await fetchUserStatsApi();
  } catch (error: any) {
    console.error('Failed to load user stats:', error);
    userStatsError.value = error.message || '加载用户数据失败';
  } finally {
    isLoadingUserStats.value = false;
  }
}

// 获取文章数据
async function loadArticleStats() {
  isLoadingArticleStats.value = true;
  articleStatsError.value = null;
  try {
    articleStats.value = await fetchArticleStatsApi();
  } catch (error: any) {
    console.error('Failed to load article stats:', error);
    articleStatsError.value = error.message || '加载文章数据失败';
  } finally {
    isLoadingArticleStats.value = false;
  }
}

// 获取热门文章数据
async function loadTopArticles() {
  isLoadingTopArticles.value = true;
  topArticlesError.value = null;
  try {
    topArticles.value = await fetchTopArticlesApi(5); // 获取前5条
  } catch (error: any) {
    console.error('Failed to load top articles:', error);
    topArticlesError.value = error.message || '加载热门文章失败';
  } finally {
    isLoadingTopArticles.value = false;
  }
}

onMounted(() => {
  loadUserStats();
  loadArticleStats();
  loadTopArticles();
});
</script>

<template>
  <div class="header">
    <a-page-header
        style="border: 1px solid rgb(235, 237, 240)"
        title="数据统计"
        :back-icon="false"
    />
  </div>
  <div class="data-statistics-dashboard" style="padding: 24px; background-color: #f0f2f5;">

    <!-- 用户数据 -->
    <a-card title="用户数据统计" :loading="isLoadingUserStats" style="margin-bottom: 24px;">
      <div v-if="userStatsError">
        <a-alert :message="userStatsError" type="error" show-icon />
      </div>
      <div v-if="!isLoadingUserStats && userStats">
        <a-row :gutter="[16, 24]">
          <a-col :xs="24" :sm="12" :md="8" :span="8" :offset="8">
            <a-statistic title="用户总量 (注册)" :value="userStats.totalUsers" />
          </a-col>
        </a-row>
        <a-divider orientation="left" style="margin-top: 24px; margin-bottom: 16px;">新增用户</a-divider>
        <a-row :gutter="[16, 24]">
          <a-col :xs="24" :sm="12" :md="8">
            <a-statistic title="今日新增" :value="userStats.newUsers.daily">
              <template #suffix>人</template>
            </a-statistic>
          </a-col>
          <a-col :xs="24" :sm="12" :md="8">
            <a-statistic title="本周新增" :value="userStats.newUsers.weekly">
              <template #suffix>人</template>
            </a-statistic>
          </a-col>
          <a-col :xs="24" :sm="12" :md="8">
            <a-statistic title="本月新增" :value="userStats.newUsers.monthly">
              <template #suffix>人</template>
            </a-statistic>
          </a-col>
        </a-row>
        <a-divider orientation="left" style="margin-top: 24px; margin-bottom: 16px;">活跃用户</a-divider>
        <a-row :gutter="[16, 24]">
          <a-col :xs="24" :sm="12" :md="8">
            <a-statistic title="日活跃用户 (DAU)" :value="userStats.activeUsers.dau" />
          </a-col>
          <a-col :xs="24" :sm="12" :md="8">
            <a-statistic title="周活跃用户 (WAU)" :value="userStats.activeUsers.wau" />
          </a-col>
          <a-col :xs="24" :sm="12" :md="8">
            <a-statistic title="月活跃用户 (MAU)" :value="userStats.activeUsers.mau" />
          </a-col>
        </a-row>
      </div>
      <a-skeleton :loading="isLoadingUserStats" active :paragraph="{ rows: 6 }" v-if="isLoadingUserStats" />
    </a-card>

    <!-- 文章数据 -->
    <a-card title="文章数据统计" :loading="isLoadingArticleStats" style="margin-bottom: 24px;">
      <div v-if="articleStatsError">
        <a-alert :message="articleStatsError" type="error" show-icon />
      </div>
      <div v-if="!isLoadingArticleStats && articleStats">
        <a-row :gutter="[16, 24]">
          <a-col :xs="24" :sm="12" :md="8" :lg="6">
            <a-statistic title="文章总数" :value="articleStats.totalArticles" />
          </a-col>
          <a-col :xs="24" :sm="12" :md="8" :lg="6">
            <a-statistic title="当日新增文章数" :value="articleStats.newArticlesToday" />
          </a-col>
          <a-col :xs="24" :sm="12" :md="8" :lg="6">
            <a-statistic title="评论总数" :value="articleStats.totalComments" />
          </a-col>
          <a-col :xs="24" :sm="12" :md="8" :lg="6">
            <a-statistic title="点赞总数" :value="articleStats.totalLikes" />
          </a-col>
        </a-row>
      </div>
      <a-skeleton :loading="isLoadingArticleStats" active :paragraph="{ rows: 3 }" v-if="isLoadingArticleStats" />
    </a-card>

    <!-- 热门内容排行 -->
    <a-card title="热门内容排行 (按点赞数)" :loading="isLoadingTopArticles">
      <div v-if="topArticlesError">
        <a-alert :message="topArticlesError" type="error" show-icon />
      </div>
      <div v-if="!isLoadingTopArticles && topArticles.length > 0">
        <a-list item-layout="horizontal" :data-source="topArticles">
          <template #renderItem="{ item, index }">
            <a-list-item>
              <a-list-item-meta>
                <template #title>
                  <a :href="item.url || '#'" target="_blank">{{ index + 1 }}. {{ item.title }}</a>
                </template>
                <!-- <template #description>
                  作者: {{ item.author || '未知' }}
                </template> -->
              </a-list-item-meta>
              <div><a-tag color="red">{{ item.likes }} 点赞</a-tag></div>
            </a-list-item>
          </template>
        </a-list>
      </div>
      <div v-if="!isLoadingTopArticles && topArticles.length === 0 && !topArticlesError">
        <p>暂无热门内容数据。</p>
      </div>
      <a-skeleton :loading="isLoadingTopArticles" active avatar :paragraph="{ rows: 4 }" v-if="isLoadingTopArticles" />
    </a-card>
  </div>
</template>

<style scoped>

</style>