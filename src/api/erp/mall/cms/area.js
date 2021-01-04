import request from '@/router/axios'
import Vue from "vue"
export function page(query) {
  if(query){
    query = Vue.prototype.filterObjSpace(query);
  }
  return request({
    url: '/api/mall/area/page',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return request({
    url: '/api/mall/area/addRe',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/api/mall/area/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return request({
    url: '/api/mall/area/' + id,
    method: 'delete'
  })
}

export function putObj(id, obj) {
  return request({
    url: '/api/mall/area/' + id,
    method: 'put',
    data: obj
  })
}

export function getTree() {
  return request({
    url: '/api/mall/area/getTree',
    method: 'get'
  })
}
export function getSimpleTree() {
  return request({
    url: '/api/mall/area/getSimpleTree',
    method: 'get'
  })
}
