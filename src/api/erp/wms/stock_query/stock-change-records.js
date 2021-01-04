import request from '@/router/axios'
import Vue from "vue"
export function page(query) {
  if(query){
    query = Vue.prototype.filterObjSpace(query);
  }
  return request({
    url: '/api/manager/stock-change-records/page',
    method: 'get',
    params: query
  })
}

export function summary(query) {
  if(query){
    query = Vue.prototype.filterObjSpace(query);
  }
  return request({
    url: '/api/manager/stock-change-records/summary',
    method: 'get',
    params: query
  })
}
