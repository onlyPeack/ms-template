import request from '@/router/axios'
import Vue from "vue"

export function page(query) {
    if (query) {
        query = Vue.prototype.filterObjSpace(query);
    }
    return request({
        url: '/api/manager/storage/page',
        method: 'get',
        params: query
    })
}

export function createStorage(obj) {
    return request({
        url: '/api/manager/storage/create',
        method: 'post',
        data: obj
    })
}

export function getObj(id) {
    return request({
        url: '/api/manager/storage/' + id,
        method: 'get'
    })
}

export function delObj(id) {
    return request({
        url: '/api/manager/storage/' + id,
        method: 'delete'
    })
}

export function putObj(id, obj) {
    return request({
        url: '/api/manager/storage/' + id,
        method: 'put',
        data: obj
    })
}

export const uploadPath = '/api/manager/storage/create';



export function downloadPath(url) {
    return '/api/manager/storage/downloadFile?key=' + url.substring(url.lastIndexOf('/') + 1, url.length);
}
