<script setup lang="ts">
import { h, ref, watch } from 'vue';
import { useRoute,RouterLink } from 'vue-router';
import type { MenuProps } from 'ant-design-vue';


const current = ref<string[]>(['recommend']); //
const route = useRoute();
// const items = ref<MenuProps['items']>([
//   {
//     key: 'recommend',
//     label: () => h(RouterLink, { to: '/recommend' }, '推荐'),
//     title: '推荐',
//   },
//   {
//     key: 'person',
//     label: () => h(RouterLink, { to: '/person' }, '个人中心'),
//     title: '个人中心',
//   },
// ]);
watch(
    () => route.path,
    (newPath) => {
      if (newPath.startsWith('/recommend')) {
        current.value = ['recommend'];
      } else if (newPath.startsWith('/person')) {
        current.value = ['person'];
      } else {
        current.value = [];
      }
    },
    { immediate: true } // 确保初始加载时也执行
);


</script>

<template>
  <div class="navigation-bar-container">
    <a-menu v-model:selectedKeys="current" mode="horizontal">
      <a-menu-item key="recommend">
        <RouterLink to="/recommend">推荐</RouterLink>
      </a-menu-item>
      <a-menu-item key="person">
        <RouterLink to="/person">个人中心</RouterLink>
      </a-menu-item>
    </a-menu>
  </div>
</template>

<style scoped>
.navigation-bar-container {

  display: flex;
  justify-content: center; 
  width: 100%;           
}
</style>