import request from '@/router/axios'
import Vue from "vue"
export function querySalesOrderItem(query) {
  if(query){
    query = Vue.prototype.filterObjSpace(query);
  }
  return request({
    url: '/api/wms/stock-sales-order-middle/querySalesOrderItem',
    method: 'get',
    params: query
  })
}

