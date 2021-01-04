import request from '@/router/axios'
import Vue from "vue"

export function page(query) {
    if (query) {
        query = Vue.prototype.filterObjSpace(query);
    }
    return request({
        url: '/api/manager/sales-commission-plan/page',
        method: 'get',
        params: query
    })
}

export function addObj(obj) {
    return request({
        url: '/api/manager/sales-commission-plan',
        method: 'post',
        data: obj
    })
}

export function getObj(id) {
    return request({
        url: '/api/manager/sales-commission-plan/' + id,
        method: 'get'
    })
}

export function delObj(id) {
    return request({
        url: '/api/manager/sales-commission-plan/' + id,
        method: 'delete'
    })
}

export function putObj(obj) {
    return request({
        url: '/api/manager/sales-commission-plan/' + obj.id,
        method: 'put',
        data: obj
    })
}

export function commissionStatistics(query) {
    if (query) {
        query = Vue.prototype.filterObjSpace(query);
    }
    return request({
        url: '/api/manager/sales-commission-plan/commissionStatistics',
        method: 'get',
        params: query
    })
}

export function getItemsByUserId(params) {
    return request({
        url: '/api/manager/sales-commission-plan/getItemsByUserId',
        method: 'get',
        params: params
    })
}
