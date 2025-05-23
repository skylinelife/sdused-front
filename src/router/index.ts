import {createRouter, createWebHistory} from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from "@/views/LoginView.vue";
import RegisterView from "@/views/RegisterView.vue";
import TempRegisterView from "@/views/TempRegisterView.vue";
import ManageView from "@/views/ManageView.vue";
import PersonView from "@/views/PersonView.vue";
import RecommendView from "@/views/RecommendView.vue";
import UserManagementPage from "@/components/page/UserManagementPage.vue";
import ArticleManagementPage from "@/components/page/ArticleManagementPage.vue";
import StatisticsPage from "@/components/page/StatisticsPage.vue";
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
            component:TempRegisterView,
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
            children: [
                {
                    path: 'users',
                    name: 'UserManagement',
                    component: UserManagementPage,
                },
                {
                    path: 'articles',
                    name: 'ArticleManagement',
                    component: ArticleManagementPage,
                },
                {
                    path: 'statistics',
                    name: 'Statistics',
                    component: StatisticsPage,
                },
            ],
        },
        {
            path: '/recommend',
            name: 'Recommend',
            component: RecommendView,
        },
        {
            path: '/person',
            name: 'Person',
            component: PersonView,
        },
    ],
})

// router.beforeEach((to, from, next) => {
//     const store=userInfoStore()
//     let isLogin=store.isLogin
//     if(to.name!=='login'&&to.name!=='register'&&!isLogin){
//         next({name:'login'})
//     }else if(to.name=='login'&&isLogin){
//         next({name:'home'})
//     }else{
//         next()
//     }
// })

export default router
