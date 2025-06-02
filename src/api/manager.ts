import request from "@/utils/axios.ts";

export async function getAllUsersInfo(params:any){
    console.log(params)
    const adminNameValue = params.admin_name;
    const paramsForRequest: { admin_name?: string } = {};
    if (adminNameValue !== undefined) {
        paramsForRequest.admin_name = adminNameValue;
    }
    return request({
        url: `/admin/user/list`,
        method: 'get',
        params:paramsForRequest,
    });
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
//             // 您可以根据需要添加更多字段
//         });
//     }
//
//     // 从 params 获取分页信息，如果不存在则使用默认值
//     const page = params?.page || 1;
//     const pageSize = params?.results || 10; // 'results' 是您在 usePagination 中 pageSizeKey 设置的值
//
//     // 计算当前页的数据
//     const startIndex = (page - 1) * pageSize;
//     const endIndex = page * pageSize;
//     const paginatedUsers = allMockUsers.slice(startIndex, endIndex);
//
//     // 模拟 API 延迟
//     return new Promise((resolve) => {
//         setTimeout(() => {
//             resolve({
//                 // 模拟 Axios 响应结构，其中 data 属性包含我们期望的数据
//                 data: {
//                     results: paginatedUsers, // 当前页的用户列表
//                     total: allMockUsers.length, // 所有用户的总数
//                     // 您可以根据API的实际响应添加其他字段，例如：
//                     // currentPage: page,
//                     // pageSize: pageSize,
//                 }
//             });
//         }, 500); // 模拟500ms的网络延迟
//     });
// }