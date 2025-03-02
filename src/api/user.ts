import request from "@/utils/axios.ts";

export function getUserInfo(userId:any) {
    return request({
        url: `/users/${userId}`,
        method: 'get',
    });
}