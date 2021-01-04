import request from '@/router/axios'
import Vue from "vue"
export function page(query) {
    if(query){
        query = Vue.prototype.filterObjSpace(query);
    }
    return request({
        url: '/api/manager/sales-order-stage/page',
        method: 'get',
        params: query
    })
}

export function pageAll() {
    return request({
        url: '/api/manager/sales-order-stage/pageAll',
        method: 'get'
    })
}

export function addObj(obj) {
    return request({
        url: '/api/manager/sales-order-stage',
        method: 'post',
        data: obj
    })
}

export function getObj(id) {
    return request({
        url: '/api/manager/sales-order-stage/' + id,
        method: 'get'
    })
}

export function delObj(id) {
    return request({
        url: '/api/manager/sales-order-stage/' + id,
        method: 'delete'
    })
}

export function putObj(obj) {
    return request({
        url: '/api/manager/sales-order-stage/' + obj.id,
        method: 'put',
        data: obj
    })
}

export function updateStatus(id, status) {
    return request({
        url: '/api/manager/sales-order-stage/updateStatus?id=' + id + '&status=' + status,
        method: 'post'
    })
}
