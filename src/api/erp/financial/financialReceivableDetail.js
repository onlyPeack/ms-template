import request from '@/router/axios'
import Vue from "vue"
export function selectPage(query) {
  if(query){
    query = Vue.prototype.filterObjSpace(query);
  }
  return request({
    url: '/api/manager/receivables-detail/page',
    method: 'get',
    params: query
  })
}
export function pageSalesReceive(query) {
    if(query){
        query = Vue.prototype.filterObjSpace(query);
    }
    return request({
        url: '/api/manager/sales-detail/pageSalesReceive',
        method: 'get',
        params: query
    })
}
export function pagePurchasePay(query) {
    if(query){
        query = Vue.prototype.filterObjSpace(query);
    }
    return request({
        url: '/api/manager/purchase-detail/pagePurchasePay',
        method: 'get',
        params: query
    })
}
export function pagePurchaseInvoice(query) {
    if(query){
        query = Vue.prototype.filterObjSpace(query);
    }
    return request({
        url: '/api/manager/purchase-detail/pagePurchaseInvoice',
        method: 'get',
        params: query
    })
}
export function pageSalesInvoice(query) {
    if(query){
        query = Vue.prototype.filterObjSpace(query);
    }
    return request({
        url: '/api/manager/sales-detail/pageSalesInvoice',
        method: 'get',
        params: query
    })
}
export function customerSummary(query) {
    if(query){
        query = Vue.prototype.filterObjSpace(query);
    }
    return request({
        url: '/api/manager/financial-transaction-flow/customerSummary',
        method: 'get',
        params: query
    })
}
export function page(query) {
    if(query){
        query = Vue.prototype.filterObjSpace(query);
    }
    return request({
        url: '/api/manager/receivables-detail/findSumReceivable',
        method: 'get',
        params: query
    })
}

export function customerReconciliation(query) {
    if(query){
        query = Vue.prototype.filterObjSpace(query);
    }
    return request({
        url: '/api/manager/receivables-detail/customerReconciliation',
        method: 'get',
        params: query
    })
}
