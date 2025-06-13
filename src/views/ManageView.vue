<script setup lang="ts">
import {reactive, watch, h, ref, onMounted} from 'vue';
import { useRouter, useRoute } from 'vue-router';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  FileTextOutlined,
  PieChartOutlined,
  MailOutlined,
  DesktopOutlined,
  InboxOutlined,
  AppstoreOutlined,
  UserOutlined,
} from '@ant-design/icons-vue';
import {userInfoStore} from "@/stores/user.ts";
const collapsed = ref<boolean>(false);
const router = useRouter();
const route = useRoute();
const store = userInfoStore();

onMounted(()=>{
  console.log(store.isLogin);
  console.log(store.userInfo);
  if(!store.isLogin){
    router.push('/recommend');
  }
})

const state = reactive({
  collapsed: false,
  selectedKeys: [route.name?.toString() || 'UserManagement'],
  openKeys: ['UserManagement'],
  preOpenKeys: ['UserManagement'],
});

const items = reactive([
  {
    key: 'UserManagement',
    icon: () => h(UserOutlined),
    label: '用户管理',
    title: '用户管理',
  },
  {
    key: 'ArticleManagement',
    icon: () => h(FileTextOutlined),
    label: '文章管理',
    title: '文章管理',
  },
  {
    key: 'Statistics',
    icon: () => h(PieChartOutlined),
    label: '数据统计',
    title: '数据统计',
  },
]);


watch(
  () => route.name,
  (newName) => {
    if (newName && items.some(item => item.key === newName)) {
      state.selectedKeys = [newName.toString()];
    }
  },
  { immediate: true }
);

watch(
    ()=>state.openKeys,
    (_val,oldVal)=>{
      state.preOpenKeys=oldVal;
    }
);


const handleMenuClick = (event: { key: string }) => {
  router.push({ name: event.key });
};

const handleHeaderClick=()=>{
  router.push('/recommend')
}
</script>

<template>
  <a-layout style="min-height: 100vh;display:flex">
    <a-layout-sider v-model:collapsed="collapsed" collapsible>
      <div class="title">
        <span v-if="!collapsed">BLOG管理端</span>
      </div>
      <div class="item">
        <a-menu
          v-model:openKeys="state.openKeys"
          v-model:selectedKeys="state.selectedKeys"
          mode="inline"
          theme="dark"
          :inline-collapsed="collapsed"
          :items="items"
          @click="handleMenuClick"
        ></a-menu>
      </div>
    </a-layout-sider>
    <a-layout-content style="margin: 0">
      <a-layout-header style="display: flex; justify-content: flex-end;align-items: center; padding: 0 16px;">
        <a-button type="primary" @click="handleHeaderClick" style="margin-left: 16px;">跳转推荐页</a-button>
      </a-layout-header>
      <a-layout-content style="margin: 0 18px">
        <router-view/>
      </a-layout-content>
    </a-layout-content>
  </a-layout>
</template>

<style scoped>
.title {
  height: 64px;
  line-height: 64px;
  text-align: center;
  background: rgb(0, 0, 0);
  margin: 0;
  padding: 0 16px;
  overflow: hidden;
  white-space: nowrap;
  transition: all 0.2s;
}

.title span {
  color: #ffffff;
  font-size: 18px;
  font-weight: 600;
  display: inline-block;
}

#components-layout-demo-side .logo {
  height: 32px;
  margin: 16px;
  background: rgba(255, 255, 255, 0.3);
}

.site-layout .site-layout-background {
  background: #fff;
}
[data-theme='dark'] .site-layout .site-layout-background {
  background: #141414;
}
</style>