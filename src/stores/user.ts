import {defineStore} from "pinia";
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
export const userInfoStore=defineStore('userInfo',{
    state:()=>({
        //登录状态
        isLogin:false,
        //登录用户信息
        userInfo:{
            //userId:null,
            user_name:null,
            userAuthority:0,
            userEmail:null,
        }
    }),
    persist:{
        storage:localStorage,//读取时采用sessionStorage.getItem("key")
    },
    actions:{
            // 设置登录用户信息
            setUserInfo(userData:any) {
                //this.userInfo.userId = userData.userId;
                //this.userInfo.user_name = userData.user_name;
                //this.userInfo.userPermission = userData.userPermission;
                //this.userInfo.user_phone = userData.userPhone;
                this.isLogin = true;
                this.userInfo.user_name=userData.user_name;
                this.userInfo.userAuthority=userData.user_authority;
            },

            clearUserInfo() {
                //this.userInfo.userId = null;
                this.userInfo.user_name = null;
                this.userInfo.userAuthority = 0;
                this.userInfo.userEmail = null;
                this.isLogin = false;
            },
            setLoginStatus(status:any) {
                this.isLogin = status;
            }
    }
})