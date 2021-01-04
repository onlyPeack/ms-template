import request from '@/router/axios'
import Vue from "vue"

export function page(query) {
    if (query) {
        query = Vue.prototype.filterObjSpace(query);
    }
    return request({
        url: '/api/manager/customer-type/page',
        method: 'get',
        params: query
    })
}

export function pageAll(type) {
    return request({
        url: '/api/manager/customer-type/pageAll?type=' + type,
        method: 'get',
    })
}

export function addObj(obj) {
    return request({
        url: '/api/manager/customer-type',
        method: 'post',
        data: obj
    })
}

export function getObj(id) {
    return request({
        url: '/api/manager/customer-type/' + id,
        method: 'get'
    })
}

export function delObj(id) {
    return request({
        url: '/api/manager/customer-type/' + id,
        method: 'delete'
    })
}

export function putObj(obj) {
    return request({
        url: '/api/manager/customer-type/' + obj.id,
        method: 'put',
        data: obj
    })
}
