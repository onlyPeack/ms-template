import request from '@/router/axios'
import Vue from "vue"
export function systemPage(query) {
  if(query){
    query = Vue.prototype.filterObjSpace(query);
  }
  return request({
    url: '/api/financial/financialFund/systemCapital',
    method: 'get',
    params: query
  })
}
export function stockPage(query) {
  if(query){
    query = Vue.prototype.filterObjSpace(query);
  }
  return request({
    url: '/api/financial/financialFund/stockCapital',
    method: 'get',
    params: query
  })
}
export function customerPage(query) {
  if(query){
    query = Vue.prototype.filterObjSpace(query);
  }
  return request({
    url: '/api/financial/financialFund/customerCapital',
    method: 'get',
    params: query
  })
}
export function supplierPage(query) {
  if(query){
    query = Vue.prototype.filterObjSpace(query);
  }
  return request({
    url: '/api/financial/financialFund/supplierCapital',
    method: 'get',
    params: query
  })
}
export function financialPage(query) {
  if(query){
    query = Vue.prototype.filterObjSpace(query);
  }
  return request({
    url: '/api/financial/financialFund/hjPurchaseStatistics',
    method: 'get',
    params: query
  })
}
export function stockQtyPage(query) {
  if(query){
    query = Vue.prototype.filterObjSpace(query);
  }
  return request({
    url: '/api/financial/financialFund/stockQtyBalance',
    method: 'get',
    params: query
  })
}
export function lockPage(query) {
  if(query){
    query = Vue.prototype.filterObjSpace(query);
  }
  return request({
    url: '/api/financial/financialFund/lockStockCapital',
    method: 'get',
    params: query
  })
}
export function profitPage(query) {
  if(query){
    query = Vue.prototype.filterObjSpace(query);
  }
  return request({
    url: '/api/financial/financialFund/profitAllocation',
    method: 'get',
    params: query
  })
}
export function capitalAccountHistory(query) {
  if(query){
    query = Vue.prototype.filterObjSpace(query);
  }
  return request({
    url: '/api/financial/capital-account-history/list',
    method: 'post',
    params: query
  })
}

export function getEOrderPage(query) {
  if(query){
    query = Vue.prototype.filterObjSpace(query);
  }
  return request({
    url: '/api/financial/balanceCheck/eOrder',
    method: 'get',
    params: query
  })
}



