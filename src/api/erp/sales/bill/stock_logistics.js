import request from '@/router/axios'
import Vue from "vue"
export function selectPage(query) {
    if(query){
        query = Vue.prototype.filterObjSpace(query);
    }
    return request({
        url: '/api/manager/sales-express/list',
        method: 'get',
        params: query
    })
}

export function selectPageByItem(query) {
    if(query){
        query = Vue.prototype.filterObjSpace(query);
    }
    return request({
        url: '/api/manager/sales-stock-out/selectPageByItem',
        method: 'get',
        params: query
    })
}

export function tempAddBill(obj) {
    return request({
        url: '/api/manager/sales-stock-out/tempAddBill',
        method: 'post',
        data: obj
    })
}

export function addBill(obj) {
    return request({
        url: '/api/manager/sales-express/create',
        method: 'post',
        data: obj
    })
}

export function getBill(id) {
    return request({
        url: '/api/manager/sales-stock-out/getBill?id=' + id,
        method: 'get'
    })
}

export function delObj(id) {
    return request({
        url: '/api/manager/sales-express/delete?ids=' + id,
        method: 'delete'
    })
}


export function auditBill(obj) {
    return request({
        url: '/api/manager/sales-express/update',
        method: 'post',
        data: obj
    })
}
export function electronicSurfaceSingle(id) {
    return request({
        url: '/api/manager/sales-stock-out/batchDelBill?id=' + id,
        method: 'delete'
    })
}
export function test() {
    return request({
        url: '/api/manager/project-data/test',
        method: 'post'
    })
}
export function selectExpressPage(query) {
    if(query){
        query = Vue.prototype.filterObjSpace(query);
    }
    return request({
        url: `/api/business/wms-express/page`,
        method: 'get',
        params: query
    })
}
export function selectArea() {
    return request({
        url: '/api/manager/sales-express/findRegion',
        method: 'get'
    })
}
export function findBillById(id) {
    return request({
        url: '/api/manager/sales-express/findBillById?id='+id,
        method: 'get'
    })
}

export function findExpress() {
    return request({
        url: '/api/manager/sales-express/findExpress',
        method: 'get'
    })
}