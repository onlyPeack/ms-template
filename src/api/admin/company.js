import request from '@/router/axios';
import Vue from "vue"
export function page(query) {
    if(query){
        query = Vue.prototype.filterObjSpace(query);
    }
    return request({
        url: '/api/admin/company/page',
        method: 'get',
        params: query
    })
}

export function getSelfCompany() {
    return request({
        url: '/api/admin/companyTenant/getSelfCompany',
        method: 'get'
    })
}

export function pageAll() {
    return request({
        url: '/api/manager/financial-bank-account/pageAll',
        method: 'get'
    })
}

export function addObj(obj) {
    return request({
        url: '/api/admin/company/register',
        method: 'post',
        data: obj
    })
}

export function getObj(id) {
    return request({
        url: '/api/admin/company/' + id,
        method: 'get'
    })
}

export function delObj(id) {
    return request({
        url: '/api/admin/company/' + id,
        method: 'delete'
    })
}

export function putObj(id, obj) {
    return request({
        url: '/api/admin/company/' + id,
        method: 'put',
        data: obj
    })
}

export function registerCheckMobile(mobile) {
    return request({
        url: '/api/admin/company/registerCheckMobile?mobile=' + mobile,
        method: 'post'
    })
}

export function registerCheckUserName(userName) {
    return request({
        url: '/api/admin/company/registerCheckUserName?userName=' + userName,
        method: 'post'
    })
}


export function sendRegisterSms(mobile) {
    return request({
        url: '/api/admin/company/sendRegisterSms?mobile=' + mobile,
        method: 'post'
    })
}

export function sendForgetSms(mobile) {
    return request({
        url: '/api/admin/company/sendForgetSms?mobile=' + mobile,
        method: 'post'
    })
}
