import request from '@/router/axios'
import Vue from "vue"
export function page(query) {
  if(query){
    query = Vue.prototype.filterObjSpace(query);
  }
  return request({
    url: '/api/manager/measureunit/page',
    method: 'get',
    params: query
  })
}

export function all() {
  return request({
    url: '/api/manager/measureunit/all',
    method: 'get',
  })
}

export function addObj(obj) {
  return request({
    url: '/api/manager/measureunit',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/api/manager/measureunit/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return request({
    url: '/api/manager/measureunit/' + id,
    method: 'delete'
  })
}

export function putObj(id, obj) {
  return request({
    url: '/api/manager/measureunit/' + id,
    method: 'put',
    data: obj
  })
}
export function updateStatus(id,status) {
    return request({
        url: `/api/manager/measureunit/updateStatus?id=${id}&status=${status}`,
        method: 'get'
    })
}

