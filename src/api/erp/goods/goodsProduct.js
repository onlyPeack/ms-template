import request from '@/router/axios'
import Vue from "vue"
export function page(query) {
  if(query){
    query = Vue.prototype.filterObjSpace(query);
  }
  return request({
    url: '/api/manager/goods/page',
    method: 'get',
    params: query
  })
}

export function queryType(query) {
    if(query){
        query = Vue.prototype.filterObjSpace(query);
    }
    return request({
        url: '/api/manager/stock-detail/querySumByWarehouseId',
        method: 'get',
        params: query
    })
}
export function queryStockWarning(query) {
    if(query){
        query = Vue.prototype.filterObjSpace(query);
    }
    return request({
        url: '/api/manager/stock-detail/queryStockWarning',
        method: 'get',
        params: query
    })
}
