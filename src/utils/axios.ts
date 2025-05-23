import axios from "axios";
import type { AxiosRequestConfig, AxiosResponse, AxiosError } from "axios";
import { message as AntMessage } from 'ant-design-vue';

const baseURL = '/api';

const request = axios.create({
    baseURL: baseURL,
    timeout: 5000,
});

// 请求拦截器
request.interceptors.request.use(
    (config) => {

        const token = localStorage.getItem('authToken');
        if (token && config.headers) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }

        return config;
    },
    (error: AxiosError) => {
        console.error('Request Error:', error);
        return Promise.reject(error);
    }
);

// 响应拦截器
request.interceptors.response.use(
    (response: AxiosResponse) => {

        const res = response.data;

        if (res.code !== 200 && res.code !== 0) {
            AntMessage.error(res.message || 'Error');

            if (res.code === 401 || res.code === 403) {
                console.error('认证失败或无权限，请重新登录');
                localStorage.removeItem('authToken');
            }
            return Promise.reject(new Error(res.message || 'Error'));
        } else {
            return res.data;
        }
    },
    (error: AxiosError) => {
        console.error('Response Error:', error);

        let errorMessage = '请求失败，请稍后再试';

        if (error.response) {
            const status = error.response.status;
            const data: any = error.response.data;
            switch (status) {
                case 400:
                    errorMessage = data?.message || '请求参数错误';
                    break;
                case 401:
                    errorMessage = '未授权，请重新登录';
                    // router.push('/login');
                    localStorage.removeItem('authToken');
                    // window.location.href = '/login';
                    break;
                case 403:
                    errorMessage = '禁止访问';
                    break;
                case 404:
                    errorMessage = '请求的资源不存在';
                    break;
                case 500:
                case 502:
                case 503:
                case 504:
                    errorMessage = `服务器错误 (${status})，请稍后再试`;
                    break;
                default:
                    errorMessage = data?.message || `请求失败 (${status})`;
            }
        } else if (error.request) {
            errorMessage = '请求超时或网络连接错误，请检查网络';
        } else {
            errorMessage = '请求配置错误';
        }

        AntMessage.error(errorMessage);
        return Promise.reject(error);
    }
);

export default request;

export const get = <T = any>(url: string, params?: object, config?: AxiosRequestConfig): Promise<T> => {
    return request.get<T, T>(url, { params, ...config });
};

export const post = <T = any>(url: string, data?: object, config?: AxiosRequestConfig): Promise<T> => {
    return request.post<T, T>(url, data, config);
};

export const put = <T = any>(url: string, data?: object, config?: AxiosRequestConfig): Promise<T> => {
    return request.put<T, T>(url, data, config);
};

export const del = <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    return request.delete<T, T>(url, config);
};