import request from '@/router/axios'
import Vue from "vue"
export function page(query) {
  if(query){
    query = Vue.prototype.filterObjSpace(query);
  }
  return request({
    url: '/api/wms/stock-locking-bill/logPage',
    method: 'get',
    params: query
  })
}


