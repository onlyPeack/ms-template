import request from '@/router/axios'
import Vue from "vue"
export function page(query) {
    if(query){
        query = Vue.prototype.filterObjSpace(query);
    }
    return request({
        url: '/api/manager/project-type/page',
        method: 'get',
        params: query
    })
}

export function pageAll() {
    return request({
        url: '/api/manager/project-type/pageAll',
        method: 'get'
    })
}

export function addObj(obj) {
    return request({
        url: '/api/manager/project-type',
        method: 'post',
        data: obj
    })
}

export function getObj(id) {
    return request({
        url: '/api/manager/project-type/' + id,
        method: 'get'
    })
}

export function delObj(id) {
    return request({
        url: '/api/manager/project-type/' + id,
        method: 'delete'
    })
}

export function putObj(obj) {
    return request({
        url: '/api/manager/project-type/' + obj.id,
        method: 'put',
        data: obj
    })
}

export function updateStatus(id, status) {
    return request({
        url: '/api/manager/project-type/updateStatus?id=' + id + '&status=' + status,
        method: 'post'
    })
}
