import request from '@/router/axios'
import Vue from "vue"
export function selectPage(query) {
    if(query){
        query = Vue.prototype.filterObjSpace(query);
    }
    return request({
        url: '/api/manager/other-stock-out/selectPage',
        method: 'get',
        params: query
    })
}

export function selectPageByItem(query) {
    if(query){
        query = Vue.prototype.filterObjSpace(query);
    }
    return request({
        url: '/api/manager/other-stock-out/selectPageByItem',
        method: 'get',
        params: query
    })
}

export function tempAddBill(obj) {
    return request({
        url: '/api/manager/other-stock-out/tempAddBill',
        method: 'post',
        data: obj
    })
}

export function addBill(obj) {
    return request({
        url: '/api/manager/other-stock-out/addBill',
        method: 'post',
        data: obj
    })
}

export function getBill(id) {
    return request({
        url: '/api/manager/other-stock-out/getBill?id=' + id,
        method: 'get'
    })
}

export function batchDelBill(ids) {
    return request({
        url: '/api/manager/other-stock-out/batchDelBill?ids=' + ids,
        method: 'delete'
    })
}


export function auditBill(obj) {
    return request({
        url: '/api/manager/other-stock-out/auditBill',
        method: 'post',
        data: obj
    })
}
