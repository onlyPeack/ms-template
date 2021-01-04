import request from '@/router/axios'
import Vue from "vue"
export function page(query) {
  if(query){
    query = Vue.prototype.filterObjSpace(query);
  }
  return request({
    url: '/api/hrm/staffPerformance/page',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return request({
    url: '/api/hrm/staffPerformance',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/api/hrm/staffPerformance/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return request({
    url: '/api/hrm/staffPerformance/' + id,
    method: 'delete'
  })
}

export function putObj(id, obj) {
  return request({
    url: '/api/hrm/staffPerformance/' + id,
    method: 'put',
    data: obj
  })
}
