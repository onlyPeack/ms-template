import request from '@/router/axios'
import Vue from "vue"
export function findProduceData(query) {
    if(query){
        query = Vue.prototype.filterObjSpace(query);
    }
    return request({
        url: `/api/manager/project-order/findProductData/${query.billNo}`,
        method: 'post',
    })
}
export function findProjectTable(query) {
    if(query){
        query = Vue.prototype.filterObjSpace(query);
    }
    return request({
        url: `/api/manager/project-order/findProjectTable/${query.billNo}`,
        method: 'post',
    })
}
