/**
 * 全站http配置
 *
 * axios参数说明
 * isSerialize是否开启form表单提交
 * isToken是否需要token
 */
import axios from 'axios'
import store from '@/store/';
import router from '@/router/router'
import {serialize} from '@/util/util'
import {getToken} from '@/util/auth'
import {Message} from 'element-ui'
import website from '@/config/website';
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import Vue from 'vue'
axios.defaults.timeout = 10000;
//返回其他状态吗
axios.defaults.validateStatus = function (status) {
    return status >= 200 && status <= 500; // 默认的
};
//跨域请求，允许保存cookie
axios.defaults.withCredentials = true;
// NProgress Configuration
NProgress.configure({
    showSpinner: false
});
//HTTPrequest拦截
axios.interceptors.request.use(config => {
    NProgress.start() // start progress bar
    const meta = (config.meta || {});
    const isToken = meta.isToken;
    const isTokens = isToken == undefined ? true : false;
    if (!isTokens) {
        config.headers['Authorization'] = 'Basic dnVlOnZ1ZQ==';
    } else {
        if (getToken()) {
            config.headers['Authorization'] = 'Bearer ' + getToken() // 让每个请求携带token--['Authorization']为自定义key 请根据实际情况自行修改
            //config.headers['shop-tenantId']=Vue.prototype.tenantId
        }
    }
    //headers中配置serialize为true开启序列化
    if (config.method === 'post' && meta.isSerialize === true) {
        config.data = serialize(config.data);
    }
    return config
}, error => {
    return Promise.reject(error)
});
//HTTPresponse拦截
axios.interceptors.response.use(res => {
    if (res.status == 400 && res.request.responseURL.indexOf('/api/auth/oauth/token') > -1) {
        Message({
            message: '用户名或密码错误',
            type: 'warning'
        })
        window.location.href="http://erp.msebc.com/msycs.html" ;
    }
    NProgress.done();
    const status = Number(res.status) || 200;
    const statusWhiteList = website.statusWhiteList || [];
    const message = res.data.msg || res.data.message || '未知错误';
    //如果在白名单里则自行catch逻辑处理
    if (statusWhiteList.includes(status)) return Promise.reject(res);
    //如果是401则跳转到登录页面
    if (status === 401) store.dispatch('FedLogOut').then(() => {
        window.location.href="http://erp.msebc.com/msycs.html" ;
    });
    if(status === 401){
       window.location.href="http://erp.msebc.com/msycs.html" ;
    }
    // 如果请求为非200否者默认统一处理
    if (status !== 200) {
        if (message == 'User token is invalid!' || message == 'User token expired!') {
            Message({
                message: '登录超时,请重新登录',
                type: 'warning'
            })
            window.location.href="http://erp.msebc.com/msycs.html" ;
        } else {
            Message({
                message: message,
                type: 'warning'
            })
        }
        return Promise.reject(new Error(message))
    }
    return res;
}, error => {
    NProgress.done();
    return Promise.reject(new Error(error));
})

export default axios;
