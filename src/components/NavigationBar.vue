<script setup lang="ts">
import { h, ref } from 'vue';
import { RouterLink } from 'vue-router';
import type { MenuProps } from 'ant-design-vue';

const current = ref<string[]>(['recommend']); //

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