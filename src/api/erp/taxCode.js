import request from '@/router/axios'
import Vue from "vue"
export function selectPage(query) {
    if(query){
        query = Vue.prototype.filterObjSpace(query);
    }
    return request({
        url: '/api/manager/goodsTaxCode/page',
        method: 'get',
        params: query
    })
}

export function addGoodsTaxCode(obj) {
    return request({
        url: '/api/manager/goodsTaxCode',
        method: 'post',
        data: obj
    })
}

export function getGoodsTaxCode(id) {
    return request({
        url: '/api/manager/goodsTaxCode/' + id,
        method: 'get'
    })
}

export function batchGoodsTaxCode(ids) {
    return request({
        url: '/api/manager/goodsTaxCode/' + ids,
        method: 'delete'
    })
}


export function puttGoodsTaxCode(obj) {
    return request({
        url: '/api/manager/goodsTaxCode',
        method: 'put',
        data: obj
    })
}
