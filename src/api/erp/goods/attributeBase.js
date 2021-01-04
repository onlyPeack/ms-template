import request from '@/router/axios'
import Vue from "vue"
export function page(query) {
  if(query){
    query = Vue.prototype.filterObjSpace(query);
  }
  return request({
    url: '/api/manager/attributeBase/page',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return request({
    url: '/api/manager/attributeBase',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/api/manager/attributeBase/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return request({
    url: '/api/manager/attributeBase/' + id,
    method: 'delete'
  })
}

export function putObj(id, obj) {
  return request({
    url: '/api/manager/attributeBase/' + id,
    method: 'put',
    data: obj
  })
}

export function all() {
  return request({
    url: '/api/manager/attributeBase/all',
    method: 'get'
  })
}
