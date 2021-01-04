import request from '@/router/axios'
import Vue from "vue"
export function page(query) {
  if(query){
    query = Vue.prototype.filterObjSpace(query);
  }
  return request({
    url: '/api/oa/taskNow/page',
    method: 'get',
    params: query
  })
}


export function addObj(obj) {
  return request({
    url: '/api/oa/taskNow',
    method: 'post',
    data: obj
  })
}

export function audit(obj) {
  return request({
    url: '/api/manager/creditAdjust/audit',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/api/oa/taskNow/' + id,
    method: 'get'
  })
}

export function batchDelBill(ids) {
  return request({
    url: '/api/oa/taskNow/batchDelBill?ids=' + ids,
    method: 'delete'
  })
}

export function putObj(id, obj) {
  return request({
    url: '/api/oa/taskNow/' + id,
    method: 'put',
    data: obj
  })
}

