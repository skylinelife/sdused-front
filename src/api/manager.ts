import request from "@/utils/axios.ts";
import type {ArticleStats, TopArticle, UserStats} from "@/components/page/StatisticsPage.vue";

export async function getAllUsersInfo(params:any){
    return request({
        url: `/admin/user/list`,
        method: 'get',
        params:params,
    });
}

export async function updateUserInfo(data:any){
    return request({
        url:`/user/update`,
        method:'post',
        data:data,
    })
}

export async function setUserPassword(data:any){
    return request({
        url:`/user/set-password`,
        method:'post',
        data:data,
    })
}

export async function getArticleList(params:any){
    return request({
        url:`/article/list`,
        method:'get',
        params:params,
    })
}

export async function getArticleDetail(params:any){
    console.log('getArticleDetail',params)
    return request({
        url:`/article/detail/${params}`,
        method:'get',
    })
}

export async function getArticleComment(params:any){
    return request({
        url:`/comment/list/${params}`,
        method:'get',
    })
}

export async function deleteArticle(data:any){
    return request({
        url:`/article/delete/${data}`,
        method:'post',
        data:data,
    })
}

export async function deleteComment(data:any){
    return request({
        url:`/comment/delete`,
        method:'post',
        data:data,
    })
}

export async function fetchUserStats():Promise<UserStats>{
    return request({
        url:`/user/state`,
        method:'get',
    })
}

export async function fetchArticleStats():Promise<ArticleStats>{
    return request({
        url:`/article/state`,
        method:'get',
    })
}

export async function fetchTopArticles():Promise<TopArticle>{
    return request({
        url:`/article/top`,
        method:'get',
    })
}

// 模拟API调用
// const mockDelay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
//
// export async function fetchUserStatsApi(): Promise<UserStats> {
//     await mockDelay(1000);
//     return {
//         totalUsers: 12345,
//         newUsers: {
//             daily: 52,
//             weekly: 350,
//             monthly: 1200,
//         },
//         activeUsers: {
//             dau: 1500,
//             wau: 5500,
//             mau: 9500,
//         },
//     };
// }

// export async function fetchArticleStatsApi(): Promise<ArticleStats> {
//     await mockDelay(1200);
//     return {
//         totalArticles: 587,
//         newArticlesToday: 12,
//         totalComments: 2340,
//         totalLikes: 15032,
//     };
// }
//
// export async function fetchTopArticlesApi(limit: number = 5): Promise<TopArticle[]> {
//     await mockDelay(800);
//     return [
//         { id: '1', title: '探索Vue 3 Composition API的奥秘', likes: 1250 },
//         { id: '2', title: '深入理解TypeScript泛型编程', likes: 980 },
//         { id: '3', title: 'Ant Design Vue实战指南', likes: 850 },
//         { id: '4', title: '后端架构演进之路：从单体到微服务', likes: 760 },
//         { id: '5', title: '数据可视化入门与实践', likes: 620 },
//     ].slice(0, limit);
// }

// import request from "@/utils/axios.ts";


// export function getAllUsersInfo(params: any) {
//     // 模拟的总用户数据
//     const allMockUsers = [];
//     const totalUsers = 50; // 假设总共有50条用户数据
//
//     for (let i = 1; i <= totalUsers; i++) {
//         allMockUsers.push({
//             id: i,
//             username: `User${i}`,
//             sex: i % 2 === 0 ? '男' : '女',
//             email: `user${i}@example.com`,
//
//         });
//     }
//
//     // 从 params 获取分页信息，如果不存在则使用默认值
//     const page = params?.page || 1;
//     const pageSize = params?.results || 10; // 'results' 是您在 usePagination 中 pageSizeKey 设置的值
//
//
//     const startIndex = (page - 1) * pageSize;
//     const endIndex = page * pageSize;
//     const paginatedUsers = allMockUsers.slice(startIndex, endIndex);
//
//
//     return new Promise((resolve) => {
//         setTimeout(() => {
//             resolve({
//                 // 模拟 Axios 响应结构，其中 data 属性包含我们期望的数据
//                 data: {
//                     results: paginatedUsers, // 当前页的用户列表
//                     total: allMockUsers.length, // 所有用户的总数
//
//                 }
//             });
//         }, 500); // 模拟500ms的网络延迟
//     });
// }