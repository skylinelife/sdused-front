<script setup lang="ts">
import {RouterLink, RouterView, useRoute, useRouter} from 'vue-router'
import NavigationBar from './components/NavigationBar.vue';
import HelloWorld from './components/HelloWorld.vue';
import {userInfoStore} from './stores/user.ts'
import {computed} from 'vue'

const store=userInfoStore()
const isLogin=computed(()=>store.isLogin)
const router=useRouter();
const route= useRoute();

const logout=()=>{
  store.clearUserInfo();
  router.push('/login');
}

const manage=()=>{
  router.push('/manage');
}

const showHeader = computed(() => {
  return !route.path.startsWith('/manage');
});
</script>

<template>
  <header v-if="showHeader">
    <NavigationBar/>
    <a-button class="logout-button" @click="manage" v-if="store.userInfo.userAuthority">跳转至管理端</a-button>
    <a-button class="logout-button" @click="logout" v-if="isLogin">退出登录</a-button>
    <a-button class="logout-button" @click="logout" v-else>登录</a-button>
  </header>

  <RouterView/>
</template>

<style scoped>
html,body{
  width: 100%;
  height: 100%;
  margin: 0;
}
header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
