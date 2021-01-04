import request from '@/router/axios'
import Vue from "vue"

//查询列表页
export function page(query) {
    if (query) {
        query = Vue.prototype.filterObjSpace(query);
    }
    return request({
        url: '/api/manager/configure-code/page',
        method: 'get',
        params: query
    })
}

//查看
export function getObj(id) {
    return request({
        url: '/api/manager/configure-code/' + id,
        method: 'get'
    })
}

//编辑
export function putObj(id, obj) {
    return request({
        url: '/api/manager/configure-code/' + id,
        method: 'put',
        data: obj
    })
}

//
export function preview(key,timeType,length,start) {
    return request({
        url: `/api/manager/configure-code/preview?key=${key}&timeType=${timeType}&length=${length}&start=${start}`,
        method: 'get'
    })
}


