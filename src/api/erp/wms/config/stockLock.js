import request from '@/router/axios'
import Vue from "vue"
export function page(query) {
  if(query){
    query = Vue.prototype.filterObjSpace(query);
  }
  return request({
    url: '/api/wms/stock-locking-bill/page',
    method: 'get',
    params: query
  })
}

export function lock(obj) {
  return request({
    url: '/api/wms/stock-locking-bill/lock',
    method: 'post',
    data: obj
  })
}

export function unlock(obj) {
  return request({
    url: '/api/wms/stock-locking-bill/unlock',
    method: 'post',
    data: obj
  })
}
