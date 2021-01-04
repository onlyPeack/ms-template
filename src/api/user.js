import request from '@/router/axios';
import {baseUrl} from '@/config/env';

export const loginByUsername = (username, password, tenantId) => request({
    url:'/api/auth/oauth/token',
    method: 'post',
    data: {
        username,
        password,
        tenantId,
        grant_type: 'password'
    },
    meta:{
        isToken: false,
    },
    transformRequest: [function (data) {
        // Do whatever you want to transform the data
        let ret = ''
        for (const it in data) {
            ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
        }
        return ret
    }],
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    }
})

export const getUserInfo = () => request({
    url:'/api/admin/user/front/info',
    method: 'get',
});

export const refeshToken = () => request({
    url: baseUrl + '/user/refesh',
    method: 'post'
})

export const getMenu = (type = 0) => request({
    url: baseUrl + '/user/getMenu',
    method: 'get',
    data: {
        type
    }
});

export const getTopMenu = () => request({
    url: '/api/admin/user/front/menus',
    method: 'get',
});

export const sendLogs = (list) => request({
    url: baseUrl + '/user/logout',
    method: 'post',
    data: list
})

export const logout = (token) => request({
    url: '/api/auth/oauth/token',
    meta:{
        isToken: false,
    },
    params: {
        access_token:'Bearer ' + token
    },
    method: 'delete'
})

export const registerCheckMobile = (mobile) => request({
    url: `/api/admin/company/registerCheckMobile?mobile=${mobile}`,
    meta:{
        isToken: false,
    },
    method: 'post'
})

export const sendRegisterSms = (mobile) => request({
    url: `/api/admin/company/sendRegisterSms?mobile=${mobile}`,
    meta:{
        isToken: false,
    },
    method: 'post'
})
export const sendForgetSms = (mobile) => request({
    url: `/api/admin/company/sendForgetSms?mobile=${mobile}`,
    meta:{
        isToken: false,
    },
    method: 'post'
})

export const registerCheckUserName = (userName) => request({
    url: `/api/admin/company/registerCheckUserName?userName=${userName}`,
    meta:{
        isToken: false,
    },
    method: 'post'
})

export const forgetPassword = (phoneCode,phone,password) => request({
    url: `/api/admin/user/forgetPassword?phoneCode=${phoneCode}&phone=${phone}&password=${password}`,
    meta:{
        isToken: false,
    },
    method: 'post'
})

export const register = (list) => request({
    url: `/api/admin/company/register`,
    method: 'post',
    meta:{
        isToken: false,
    },
    data: list
})


export const queryAmount = () => request({
    url: `/api/manager/home-page-data/queryAmount`,
    method: 'get'
})

export const queryRank = (type,dataType) => request({
    url: `/api/manager/home-page-data/queryRank?type=${type}&dateType=${dataType}`,
    method: 'get'
})
export const queryWarningInfo = () => request({
    url: `/api/manager/home-page-data/queryWarningInfo`,
    method: 'get'
})

export const changePassword = (oldPass,newPass) => request({
    url: `/api/admin/user/changePassword?oldPass=${oldPass}&newPass=${newPass}`,
    method: 'post'
})

export const insertLog = () => request({
    url: `/api/admin/user/insertLog`,
    method: 'get'
})
export const beforeLoginOut = () => request({
    url: `/api/business/plt-user/beforeLoginOut`,
    method: 'get'
})