import request from '@/router/axios'
import Vue from "vue"
export function selectPage(query) {
  if(query){
    query = Vue.prototype.filterObjSpace(query);
  }
  return request({
    url: '/api/manager/sales-summary/selectPage',
    method: 'get',
    params: query
  })
}

export function selectPages(query) {
    if(query){
        query = Vue.prototype.filterObjSpace(query);
    }
    return request({
        url: '/api/manager/sales-detail/selectPage',
        method: 'get',
        params: query
    })
}
