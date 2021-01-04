import request from '@/router/axios'
import Vue from "vue"
export function page(query) {
    if(query){
        query = Vue.prototype.filterObjSpace(query);
    }
    return request({
        url: '/api/manager/bank-account-init/page',
        method: 'get',
        params: query
    })
}


export function addObj(obj) {
    return request({
        url: '/api/manager/bank-account-init',
        method: 'post',
        data: obj
    })
}

export function getObj(id) {
    return request({
        url: '/api/manager/bank-account-init/' + id,
        method: 'get'
    })
}



