import request from '@/router/axios'
import Vue from "vue"
export function page(query) {
    if(query){
        query = Vue.prototype.filterObjSpace(query);
    }
    return request({
        url: '/api/manager/product-project-type/selectPage',
        method: 'post',
        params: query
    })
}

export function addObj(obj) {
    return request({
        url: '/api/manager/product-project-type/add',
        method: 'post',
        data: obj
    })
}

export function getObj(id) {
    return request({
        url: '/api/manager/product-project-type/select/' + id,
        method: 'post'
    })
}

export function delObj(id) {
    return request({
        url: '/api/manager/product-project-type/deletes?ids=' + id,
        method: 'post'
    })
}

export function putObj(obj) {
    return request({
        url: '/api/manager/product-project-type/update',
        method: 'post',
        data: obj
    })
}

export function updateStatus(id,status) {
    return request({
        url: `/api/manager/product-project-type/updateStatus/${id}?status=${status}`,
        method: 'post',
    })
}
