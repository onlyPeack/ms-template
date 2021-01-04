import request from '@/router/axios'
import Vue from "vue"
export function selectPage(query) {
  if(query){
    query = Vue.prototype.filterObjSpace(query);
  }
  return request({
    url: '/api/manager/payable-detail/page',
    method: 'get',
    params: query
  })
}

export function supplierSummary(query) {
    if(query){
        query = Vue.prototype.filterObjSpace(query);
    }
    return request({
        url: '/api/manager/financial-transaction-flow/supplierSummary',
        method: 'get',
        params: query
    })
}
export function page(query) {
    if(query){
        query = Vue.prototype.filterObjSpace(query);
    }
    return request({
        url: '/api/manager/payable-detail/findSumPayable',
        method: 'get',
        params: query
    })
}

export function supplierReconciliation(query) {
    if(query){
        query = Vue.prototype.filterObjSpace(query);
    }
    return request({
        url: '/api/manager/payable-detail/supplierReconciliation',
        method: 'get',
        params: query
    })
}
