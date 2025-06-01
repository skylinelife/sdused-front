import {defineStore} from "pinia";
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
export const userInfoStore=defineStore('userInfo',{
    state:()=>({
        //登录状态
        isLogin:false,
        //登录用户信息
        userInfo:{
            userId:null,
            user_name:null,
            userPermission:null,
            userPhone:null,
        }
    }),
    persist:{
        storage:sessionStorage,//读取时采用sessionStorage.getItem("key")
    }
})