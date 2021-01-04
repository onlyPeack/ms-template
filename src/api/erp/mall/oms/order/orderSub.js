import request from '@/router/axios'
import Vue from "vue"
export function getOrderSubDetail(id) {
  return request({
    url: '/api/mall/oms-order-sub/' + id,
    method: 'get'
  })
}

export function selectPageByItem(query) {
  if(query){
    query = Vue.prototype.filterObjSpace(query);
  }
  return request({
    url: '/api/mall/oms-order-sub/selectPageByItem',
    method: 'get',
    params: query
  })
}

