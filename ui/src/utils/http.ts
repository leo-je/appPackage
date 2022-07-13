import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { getRouter } from '../router';

//创建axios的一个实例 
let instance = axios.create({
    //baseURL:'http://127.0.0.1:8080/',//接口统一域名
    timeout: 6000
    //设置超时
})
instance.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

//------------------- 一、请求拦截器 忽略
instance.interceptors.request.use(function (config) {
    //console.log(config);
    let token = sessionStorage.getItem("access-user")
    if(config && token){
        config.headers!.token = token;
    }
    return config;
}, function (error) {
    console.log(error);
    // 对请求错误做些什么
    console.log('请求拦截器报错');
    return Promise.reject(error);
});

//----------------- 二、响应拦截器 忽略
instance.interceptors.response.use(function (response) {
    //console.log(response);
    return response.data;
}, function (error) {
    // 对响应错误
    console.log(error)
    if (error && error.response && error.response.status == 401) {
        // router.replace({
        //     path: '/'
        // })
        // location.reload()
        sessionStorage.removeItem("access-user")
        let router = getRouter();
        router.push({ path: "/login" });
    }
    console.log('响应拦截器报错');
    return Promise.reject(error);
});

/**
 * 使用es6的export default导出了一个函数，导出的函数代替axios去帮我们请求数据，
 * 函数的参数及返回值如下：
 * @param {String} method  请求的方法：get、post、delete、put
 * @param {String} url     请求的url:
 * @param {Object} data    请求的参数
 * @returns {Promise}     返回一个promise对象，其实就相当于axios请求数据的返回值
 */
export default function (method: string, url: string, data?: any): Promise<any> {
    method = method.toLowerCase();
    if (method == 'post') {
        return instance.post(url, data)
    } else if (method == 'get') {
        return instance.get(url, { params: data })
    } else if (method == 'delete') {
        return instance.delete(url, { params: data })
    } else if (method == 'put') {
        return instance.put(url, data)
    } else {
        console.error('未知的method' + method)
        throw new Error('未知的method');
    }
}