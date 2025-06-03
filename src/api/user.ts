import request from "@/utils/axios.ts";

//获取用户信息
export async function getUserInfo(userId:any) {
    return request({
        url: `/user/${userId}`,
        method: 'get',
    });
}
//提交注册表单
export async function register(data:any) {
    return request({
        url:'/user/register',
        method:'post',
        data:data,
    });
}
//提交登录
export async function login(data:any) {
    return request({
        url:'/user/login',
        method:'post',
        data:data,
    })
}

//用户信息修改
// export async function editUserInfo(data:any){
//     return request({
//         url:''
//     })
// }


//文章推荐
// export async function recommend(data:any){
//     return request({
//         url:'',
//         method:'get',
//         data:data,
//     })
// }

//文章细节内容
export async function articleDetail(aid:any){
    return request({
        url:`/article/detail/${aid}`,
        method:'get',
    })
}

//文章点赞
export async function articleLike(data:any){
    return request({
        url:'/article/like',
        method:'post',
        data:data,
    })
}

//文章取消点赞
export async function articleUnlike(data:any){
    return request({
        url:'/article/unlike',
        method:'post',
        data:data,
    })
}