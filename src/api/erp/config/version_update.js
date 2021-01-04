import request from '@/router/axios'
import Vue from "vue"
export function page(query) {
    if(query){
        query = Vue.prototype.filterObjSpace(query);
    }
    return request({
        url: '/api/manager/version-record/page',
        method: 'get',
        params: query
    })
}

export function addObj(obj) {
    return request({
        url: '/api/manager/version-record',
        method: 'post',
        data: obj
    })
}

export function getObj(id) {
    return request({
        url: '/api/manager/version-record/' + id,
        method: 'get'
    })
}

export function delObj(id) {
    return request({
        url: '/api/manager/version-record/' + id,
        method: 'delete'
    })
}

export function putObj(obj) {
    return request({
        url: '/api/manager/version-record',
        method: 'put',
        data: obj
    })
}

