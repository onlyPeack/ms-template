import request from '@/router/axios'
import Vue from "vue"
export function selectPage(query) {
    if(query){
        query = Vue.prototype.filterObjSpace(query);
    }
    return request({
        url: '/api/manager/product-project-work/list',
        method: 'get',
        params: query
    })
}

export function addBill(obj) {
    return request({
        url: '/api/manager/product-project-work/add',
        method: 'post',
        data: obj
    })
}

export function getBill(id) {
    return request({
        url: `/api/manager/product-project-work/select/${id}`,
        method: 'post'
    })
}

export function batchDelBill(ids) {
    return request({
        url: '/api/manager/product-project-work/delete',
        method: 'post',
        data:ids,
    })
}


export function auditBill(obj) {
    return request({
        url: '/api/manager/product-project-work/update',
        method: 'post',
        data: obj
    })
}
