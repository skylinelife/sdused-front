import {createRouter, createWebHistory} from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from "@/views/LoginView.vue";
import RegisterView from "@/views/RegisterView.vue";
import ManageView from "@/views/ManageView.vue";
import {userInfoStore} from "@/stores/user.ts";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            redirect:'/login',
        },
        {
            path: '/login',
            name: 'login',
            component: LoginView,
        },
        {
            path:'/register',
            name:'register',
            component:RegisterView,
        },
        {
            path:'/home',
            name:'home',
            component:HomeView,
        },
        {
            path:'/manage',
            name:'manage',
            component:ManageView,
        },
    ],
})

router.beforeEach((to, from, next) => {
    const store=userInfoStore()
    let isLogin=store.isLogin
    if(to.name!=='login'&&to.name!=='register'&&!isLogin){
        next({name:'login'})
    }else if(to.name=='login'&&isLogin){
        next({name:'home'})
    }else{
        next()
    }
})

export default router
