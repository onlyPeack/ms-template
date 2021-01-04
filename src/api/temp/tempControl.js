import request from '@/router/axios'
import Vue from "vue"

export function addObj(data) {
    return request({
        url: '/api/cms/cms-public-model',
        method: 'post',
        data
    })
}

export function delObj(id) {
    return request({
        url: '/api/cms/cms-public-model/'+id,
        method: 'delete',
    })
}

export function getObj(id) {
    return request({
        url: '/api/cms/cms-public-model/'+id,
        method: 'get',
    })
}

export function putObj(data) {
    return request({
        url: '/api/cms/cms-public-model/'+data.id,
        method: 'put',
        data
    })
}

export function page(query) {
    if(query){
        query = Vue.prototype.filterObjSpace(query);
    }
    return request({
        url: '/api/cms/cms-public-model/page',
        method: 'get',
        params: query
    })
}

