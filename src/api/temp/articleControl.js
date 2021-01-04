import request from '@/router/axios'
import Vue from "vue"

export function addObj(data) {
    return request({
        url: '/api/cms/cms-article',
        method: 'post',
        data
    })
}

export function updateBatch(data) {
    return request({
        url: '/api/cms/cms-article/updateBatch',
        method: 'post',
        data
    })
}

export function delObj(id) {
    return request({
        url: '/api/cms/cms-article/'+id,
        method: 'delete',
    })
}

export function getObj(id) {
    return request({
        url: '/api/cms/cms-article/'+id,
        method: 'get',
    })
}

export function putObj(data) {
    return request({
        url: '/api/cms/cms-article/'+data.id,
        method: 'put',
        data
    })
}

export function page(query) {
    if(query){
        query = Vue.prototype.filterObjSpace(query);
    }
    return request({
        url: '/api/cms/cms-article/page',
        method: 'get',
        params: query
    })
}

export function list(query) {
    if(query){
        query = Vue.prototype.filterObjSpace(query);
    }
    return request({
        url: '/api/cms/cms-article/list',
        method: 'get',
        params: query
    })
}

