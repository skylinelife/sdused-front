<script setup lang="ts">
import {reactive, watch, h} from 'vue';
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
import { ref } from 'vue';
const collapsed = ref<boolean>(false);

const state = reactive({
  collapsed: false,
  selectedKeys: ['1'],
  openKeys: ['1'],
  preOpenKeys: ['1'],
})
const items = reactive([
  {
    key: '1',
    icon: ()=>h(UserOutlined),
    label: '用户管理',
    title: 'userManage',
  },
  {
    key: '2',
    icon: ()=>h(FileTextOutlined),
    label: '文章管理',
    title: 'articleManage',
  },
  {
    key: '3',
    icon: ()=>h(PieChartOutlined),
    label: '数据统计',
    title: 'statistics',
  },
]);
watch(
    ()=>state.openKeys,
    (_val,oldVal)=>{
      state.preOpenKeys=oldVal;
    }
);


const toggleCollapsed = () => {
  state.collapsed = !state.collapsed;
  state.openKeys = state.collapsed ? [] : state.preOpenKeys;
};
</script>

<template>
  <a-layout style="min-height: 100vh;display:flex">
    <a-layout-sider v-model:collapsed="collapsed" collapsible @collapse="toggleCollapsed" @expand="toggleCollapsed">
      <div class="item">
        <a-menu
          v-model:openKeys="state.openKeys"
          v-model:selectedKeys="state.selectedKeys"
          mode="inline"
          theme="dark"
          :inline-collapsed="collapsed"
          :items="items"
        ></a-menu>
      </div>
    </a-layout-sider>
  </a-layout>
</template>

<style scoped>
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
