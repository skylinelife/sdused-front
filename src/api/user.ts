import request from "@/utils/axios.ts";
import _default from "ant-design-vue/es/vc-slick/inner-slider";
import data = _default.data;

//获取用户信息
export async function getUserInfo(user_name:any) {
    return request({
        url: `/user/info`,
        method: 'get',
        params: user_name
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

export async function getArticleComment(params:any){
    return request({
        url:`/comment/list/${params}`,
        method:'get',
        params:params,
    })
}

//用户信息修改
export async function updateUserInfo(data:any){
    return request({
        url:'/user/update',
        method:'post',
        data:data,
    })
}

//用户密码修改
export async function updatePassword(data:any){
    return request({
        url:'/user/set-password',
        method:'post',
        data:data,
    })
}

//上传用户头像
export async function uploadAvatar(data:any){
    return request({
        url:'/upload/avatar',
        method:'post',
        data:data,
    })
}


//文章推荐
export async function articleRecommend(){
    return request({
        url:'/article/articleListByLiked',
        method:'get',
    })
}

//用户自己的文章列表
export async function articleMy(params: any){
    return request({
        url:'/article/searchArticleByUserName',
        method:'get',
        params:params,
    })
}

//文章细节内容
export async function articleDetail(aid:any){
    return request({
        url:`/article/detail/${aid}`,
        method:'get',
    })
}

//文章点赞
export async function articleLike(aid:any){
    return request({
        url:`/article/like/${aid}`,
        method:'post',
    })
}

//文章取消点赞
export async function articleUnlike(aid:any){
    return request({
        url:`/article/unlike/${aid}`,
        method:'post',
    })
}

//创建文章
export async function articleCreate(data:any){
    return request({
        url:'/article/create',
        method:'post',
        data:data,
    })
}

//删除文章
export async function articleDelete(article_id:any){
    return request({
        url:`/article/delete/${article_id}`,
        method:'post',
    })
}

//文章内容更新
export async function articleUpdate(data:any){
    return request({
        url:`/article/update/${data.article_id}`,
        method:'post',
        data:data,
    })
}

//发表评论
export async function addArticleComment(data:any){
    return request({
        url:'/comment/add',
        method:'post',
        data:data,
    })
}


