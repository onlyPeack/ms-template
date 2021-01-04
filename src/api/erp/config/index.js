import request from '@/router/axios'
import Vue from "vue"

export function list(query) {
    if(query){
        query = Vue.prototype.filterObjSpace(query);
    }
    return request({
        url: '/api/manager/news-notice-table/list',
        method: 'get',
        params: query
    })
}

export function findUnread() {
    return request({
        url: '/api/manager/news-notice-table/findUnread',
        method: 'get',
    })
}

export function update(data) {
    return request({
        url: `/api/manager/news-notice-table/update?ids=${data.id}&status=${data.status}`,
        method: 'post',
    })
}

export function select(id) {
    return request({
        url: '/api/manager/news-notice-table/select/'+id,
        method: 'get',
    })
}


export function addObj(obj) {
    return request({
        url: '/api/manager/table-settings',
        method: 'post',
        data: obj
    })
}


export function addPageSetting(obj) {
    return request({
        url: '/api/manager/page-setting/add',
        method: 'post',
        data: obj
    })
}

export function getPageSetting() {
    return request({
        url: '/api/manager/page-setting/get',
        method: 'get',
    })
}

export function getObj(objectKey) {
    return request({
        url: '/api/manager/table-settings/getSettings?objectKey=' + objectKey,
        method: 'get'
    })
}
export function getPrepareField(objectKey) {
    return request({
        url: '/api/manager/table-settings/getPrepareField?objectKey=' + objectKey,
        method: 'get'
    })
}
export function getDefaultWarehouse() {
    return request({
        url: '/api/manager/sales-order/getDefaultWarehouse',
        method: 'get'
    })
}
export function getPageSettings(objectKey) {
    return request({
        url: '/api/manager/table-settings/getPageSettings?objectKey=' + objectKey,
        method: 'get'
    })
}
export function reset(objectKey,type) {
    return request({
        url: `/api/manager/table-settings/reset?objectKey=${objectKey}&type=${type}` ,
        method: 'get'
    })
}

export function addPage(obj) {
    return request({
        url: '/api/manager/table-settings/addPage',
        method: 'post',
        data: obj
    })
}


