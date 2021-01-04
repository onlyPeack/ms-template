import request from '@/router/axios'
import Vue from "vue"
export function page(query) {
    if(query){
        query = Vue.prototype.filterObjSpace(query);
    }
    return request({
        url: '/api/manager/financial-transaction-flow/page',
        method: 'get',
        params: query
    })
}

