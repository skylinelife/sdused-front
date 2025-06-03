<script setup lang="ts">
import { useRouter } from 'vue-router';
import { userInfoStore } from '@/stores/user.ts';
import { onMounted } from 'vue';
import {LikeOutlined, MessageOutlined, StarOutlined} from "@ant-design/icons-vue";

const router = useRouter();
const store = userInfoStore();

// 如果未登录，跳转到登录页面
onMounted(() => {
  if (!store.isLogin) {
    alert('请先登录。');
    router.push('/login');
  }
});
const listData: Record<string, string>[] = [];

const userStore=userInfoStore();
for (let i = 0; i < 23; i++) {
  listData.push({
    href: 'https://www.antdv.com/',
    title: `ant design vue part ${i}`,
    avatar: 'https://joeschmoe.io/api/v1/random',
    description:
    userStore.userInfo.user_name,
    content:
        'We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.',
  });
}

const pagination = {
  onChange: (page: number) => {
    console.log(page);
  },
  pageSize: 3,
};
const actions: Record<string, any>[] = [
  { icon: StarOutlined, text: '156' },
  { icon: LikeOutlined, text: '156' },
  { icon: MessageOutlined, text: '2' },
];

</script>

<template>
  <div class="profile-container">
    <!-- 用户信息卡片 -->
    <div class="panel">
      <a-card class="profile-card" title="个人中心">
        <div class="avatar-wrapper avatar-horizontal">
          <a-avatar
              shape="circle"
              size="large"
              src="https://joeschmoe.io/api/v1/random"
          />
          <div class="username">{{ store.userInfo.user_name }}</div>
        </div>

        <a-descriptions
            bordered
            :column="2"
            layout="horizontal"
            size="middle"
            class="descriptions"
        >
          <a-descriptions-item label="邮箱">
            {{ store.userInfo.user_phone || "375046751@qq.com" }}
          </a-descriptions-item>
          <a-descriptions-item label="发表文章数">
            {{ store.userInfo.articleCount || 0 }}
          </a-descriptions-item>
          <a-descriptions-item label="评论数量">
            {{ store.userInfo.commentCount || 0 }}
          </a-descriptions-item>
          <a-descriptions-item label="入站时间">
            {{ store.userInfo.registerTime || "2024-01-01" }}
          </a-descriptions-item>
        </a-descriptions>
      </a-card>
    </div>

    <!-- 文章列表 -->
    <div class="panel">
      <a-list
          item-layout="vertical"
          size="large"
          :pagination="pagination"
          :data-source="listData"
      >
        <template #footer>
          <div>
            <b>ant design vue</b>
            footer part
          </div>
        </template>
        <template #renderItem="{ item }">
          <a-list-item key="item.title">
            <template #actions>
              <span v-for="{ icon, text } in actions" :key="icon">
                <component :is="icon" style="margin-right: 8px" />
                {{ text }}
              </span>
            </template>
            <template #extra>
              <img
                  width="272"
                  alt="logo"
                  src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png"
              />
            </template>
            <a-list-item-meta :description="item.description">
              <template #title>
                <a :href="item.href">{{ item.title }}</a>
              </template>
              <template #avatar>
                <a-avatar :src="item.avatar" />
              </template>
            </a-list-item-meta>
            {{ item.content }}
          </a-list-item>
        </template>
      </a-list>
    </div>
  </div>
</template>

<style scoped>
.profile-container {
  display: flex;
  flex-direction: column; /* 垂直排列 */
  align-items: center; /* 居中 */
  min-height: 100vh;
  padding: 60px 16px;
  background-color: #f0f2f5;
  gap: 40px; /* 上下间距 */
}

.panel {
  width: 100%; /* 统一宽度 */
  min-width: 400px;
  max-width: 1200px;
}

.profile-card {
  width: 100%; /* 撑满 panel 宽度 */
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
</style>
