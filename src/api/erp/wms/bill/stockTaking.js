import request from '@/router/axios'
import Vue from "vue"
export function selectPage(query) {
    if(query){
        query = Vue.prototype.filterObjSpace(query);
    }
    return request({
        url: '/api/manager/check-stock/selectPage',
        method: 'get',
        params: query
    })
}

export function selectPageByItem(query) {
    if(query){
        query = Vue.prototype.filterObjSpace(query);
    }
    return request({
        url: '/api/manager/check-stock/selectPageByItem',
        method: 'get',
        params: query
    })
}

export function tempAddBill(obj) {
    return request({
        url: '/api/manager/check-stock/tempAddBill',
        method: 'post',
        data: obj
    })
}

export function addBill(obj) {
    return request({
        url: '/api/manager/check-stock/addBill',
        method: 'post',
        data: obj
    })
}

export function getBill(id) {
    return request({
        url: '/api/manager/check-stock/getBill?id=' + id,
        method: 'get'
    })
}

export function batchDelBill(ids) {
    return request({
        url: '/api/manager/check-stock/batchDelBill?ids=' + ids,
        method: 'delete'
    })
}


export function auditBill(obj) {
    return request({
        url: '/api/manager/check-stock/auditBill',
        method: 'post',
        data: obj
    })
}
