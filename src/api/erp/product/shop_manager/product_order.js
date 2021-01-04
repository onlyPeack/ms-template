import request from '@/router/axios'
import Vue from "vue"
export function selectPage(query) {
    if(query){
        query = Vue.prototype.filterObjSpace(query);
    }
    return request({
        url: '/api/manager/product-production-order/selectPage',
        method: 'get',
        params: query
    })
}

export function selectPageByItem(query) {
    if(query){
        query = Vue.prototype.filterObjSpace(query);
    }
    return request({
        url: '/api/manager/product-production-order/selectPageByItem',
        method: 'get',
        params: query
    })
}

export function selectPages(query) {
    if(query){
        query = Vue.prototype.filterObjSpace(query);
    }
    return request({
        url: '/api/manager/product-production-order/selectPageByItem',
        method: 'get',
        params: query
    })
}

export function selectPageByItems(query) {
    if(query){
        query = Vue.prototype.filterObjSpace(query);
    }
    return request({
        url: '/api/manager/product-production-order/findAll',
        method: 'post',
        params: query
    })
}

export function tempAddBill(obj) {
    return request({
        url: '/api/manager/product-production-order/tempAddBill',
        method: 'post',
        data: obj
    })
}

export function addBill(obj) {
    return request({
        url: '/api/manager/product-production-order/addBill',
        method: 'post',
        data: obj
    })
}

export function getBill(id) {
    return request({
        url: '/api/manager/product-production-order/getBill?id=' + id,
        method: 'get'
    })
}

export function batchDelBill(ids) {
    return request({
        url: '/api/manager/product-production-order/batchDelBill?ids=' + ids,
        method: 'delete'
    })
}
export function revokeDate(id) {
    return request({
        url:`/api/manager/product-production-order/revokeDate/${id}`,
        method: 'post'
    })
}

export function auditBill(obj) {
    return request({
        url: '/api/manager/product-production-order/auditBill',
        method: 'post',
        data: obj
    })
}



export function lockStock(obj) {
    return request({
        url:`/api/manager/product-production-order/lockStock`,
        method: 'post',
        data: obj
    })
}
export function findList(id) {
    return request({
        url:`/api/manager/product-production-order/findList/${id}`,
        method: 'post',
    })
}
export function findBill(id) {

    return request({
        url:`/api/manager/product-production-order/findAll/${id}`,
        method: 'post',
    })
}


export function findBills(query) {

    return request({
        url:`/api/manager/product-production-order/findAll`,
        method: 'post',
        params: query
    })
}

export function findCanReturn(query) {

    return request({
        url:`/api/manager/product-production-order/findCanReturn`,
        method: 'post',
        params: query
    })
}

export function pageBySingleProduct(query) {
    return request({
        url:`/api/manager/stock-detail/pageBySingleProduct`,
        method: 'get',
        params: query
    })
}



