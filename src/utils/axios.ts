import axios from "axios";
const request =axios.create({
    baseURL:'',
    timeout:5000,
})


request.interceptors.request.use(
    (config) => {
        // 在发送请求之前

        return config;
    },
    (error) => {

        return Promise.reject(error);
    }
);


// 响应拦截器
request.interceptors.response.use(
    response => {
        // 对响应数据做些什么
        return response.data;
    },
    error => {
        // 对响应错误做些什么
        if (error.response) {
            switch (error.response.status) {
                case 401:
                    // 处理未授权的错误
                    console.error('未授权，请重新登录');
                    break;
                case 404:
                    // 处理资源不存在的错误
                    console.error('请求的资源不存在');
                    break;
                default:
                    console.error('请求失败，请稍后再试');
            }
        } else if (error.request) {
            console.error('请求失败，请检查网络连接');
        } else {
            console.error('请求配置错误');
        }
        return Promise.reject(error);
    }
);

export default request