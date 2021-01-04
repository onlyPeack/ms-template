import request from '@/router/axios';
import Vue from "vue"
export function page(query) {
    if(query){
        query = Vue.prototype.filterObjSpace(query);
    }
    return request({
        url: '/api/admin/user/selectPage',
        method: 'get',
        params: query
    })
}


export function collectType(query) {
    return request({
        url: '/api/manager/receiveAddress/pageByCustomerName',
        method: 'get',
        params: query
    })
}

export function selectPageForCommission(query) {
    if(query){
        query = Vue.prototype.filterObjSpace(query);
    }
    return request({
        url: '/api/admin/user/selectPageForCommission',
        method: 'get',
        params: query
    })
}

export function fullUserPage(query) {
    return request({
        url: '/api/admin/user/fullUserPage',
        method: 'get',
        params: query
    })
}

export function userSelectPage(query) {
    return request({
        url: '/api/admin/user/page',
        method: 'get',
        params: query
    })
}

export function addObj(obj) {
    return request({
        url: '/api/admin/user/addUser/',
        method: 'post',
        data: obj
    })
}

export function getObj(id) {
    return request({
        url: '/api/admin/user/' + id,
        method: 'get'
    })
}

export function delObj(id) {
    return request({
        url: '/api/admin/user/' + id,
        method: 'delete'
    })
}

export function putObj(id, obj) {
    return request({
        url: '/api/admin/user/' + id,
        method: 'put',
        data: obj
    })
}

export function updateUser(obj) {
    return request({
        url: '/api/admin/user/updateUser',
        method: 'post',
        data: obj
    })
}


export function changePassword(data) {
    return request({
        url: '/api/admin/user/changePassword',
        method: 'post',
        params: data
    })
}

export function forgetPassword(phoneCode, phone, password) {
    return request({
        url: '/api/admin/user/forgetPassword?phoneCode=' + phoneCode + '&phone=' + phone + '&password=' + password,
        method: 'post'
    })
}

export function validate(data) {
    return request({
        url: '/api/admin/user/validate',
        method: 'post',
        params: data
    })
}

export function saveQuickMenu(data) {
    return request({
        url: '/api/admin/user/saveQuickMenu?menuIds=' + data,
        method: 'post'
    })
}

export function getQuickMenu() {
    return request({
        url: '/api/admin/user/getQuickMenu',
        method: 'get'
    })
}


export function updateStatus(id,status) {
    return request({
        url: `/api/admin/user/updateStatus?id=${id}&status=${status}`,
        method: 'post',
    })
}
