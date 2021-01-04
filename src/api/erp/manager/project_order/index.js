import request from '@/router/axios'
import Vue from "vue"
export function selectPage(query) {
    if(query){
        query = Vue.prototype.filterObjSpace(query);
    }
    return request({
        url: '/api/manager/project-order/selectPage',
        method: 'get',
        params: query
    })
}

export function selectPageByItem(query) {
    if(query){
        query = Vue.prototype.filterObjSpace(query);
    }
    return request({
        url: '/api/manager/project-order/selectPageByItem',
        method: 'get',
        params: query
    })
}

export function selectItemBillByPage(query) {
    if(query){
        query = Vue.prototype.filterObjSpace(query);
    }
    return request({
        url: '/api/manager/project-order/selectItemBillByPage',
        method: 'get',
        params: query
    })
}

export function slectItemBillByPageSummary(query) {
    if(query){
        query = Vue.prototype.filterObjSpace(query);
    }
    return request({
        url: '/api/manager/project-order/selectItemBillByPageSummary',
        method: 'get',
        params: query
    })
}

export function slectItemBillByPageSummarys(query) {
    if(query){
        query = Vue.prototype.filterObjSpace(query);
    }
    return request({
        url: '/api/manager/product-production-order/selectItemBillByPageSummary',
        method: 'get',
        params: query
    })
}

export function tempAddBill(obj) {
    return request({
        url: '/api/manager/project-order/tempAddBill',
        method: 'post',
        data: obj
    })
}

export function addBill(obj) {
    return request({
        url: '/api/manager/project-order/addBill',
        method: 'post',
        data: obj
    })
}

export function getBill(id) {
    return request({
        url: '/api/manager/project-order/getBill?id=' + id,
        method: 'get'
    })
}
export function findDetailed(id) {
    return request({
        url: '/api/manager/project-order/findDetailed/' + id,
        method: 'post'
    })
}

export function batchDelBill(ids) {
    return request({
        url: '/api/manager/project-order/batchDelBill?ids=' + ids,
        method: 'delete'
    })
}


export function auditBill(obj) {
    return request({
        url: '/api/manager/project-order/auditBill',
        method: 'post',
        data: obj
    })
}
export function generateProductOrder(obj) {
    return request({
        url: '/api/manager/project-order/generateProductOrder',
        method: 'post',
        data: obj
    })
}
export function exportProjectOrder(id) {
    return request({
        url: `/api/manager/project-order/exportProjectOrder?id=${id}`,
        method: 'get',
        responseType: "blob"
    })
}
