import request from '@/router/axios'
import Vue from "vue";

export function addObj(data) {
    return request({
        url: '/api/cms/cms-url-relationship',
        method: 'post',
        data
    })
}

export function putObj(data) {
    return request({
        url: '/api/cms/cms-url-relationship/'+data.id,
        method: 'post',
        data
    })
}

export function page(query) {
    if(query){
        query = Vue.prototype.filterObjSpace(query);
    }
    return request({
        url: '/api/cms/cms-url-relationship/page',
        method: 'get',
        params: query
    })
}

export function delObj(id) {
    return request({
        url: '/api/cms/cms-url-relationship/'+id,
        method: 'delete',
    })
}
