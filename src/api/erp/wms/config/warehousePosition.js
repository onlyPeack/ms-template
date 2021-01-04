import request from '@/router/axios'
import Vue from "vue"
export function page(query) {
  if(query){
    query = Vue.prototype.filterObjSpace(query);
  }
  return request({
    url: '/api/manager/warehouse-position/page',
    method: 'get',
    params: query
  })
}

export function selectPage(query) {
  return request({
    url: '/api/manager/warehouse-position/selectPage',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return request({
    url: '/api/manager/warehouse-position',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/api/manager/warehouse-position/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return request({
    url: '/api/manager/warehouse-position/' + id,
    method: 'delete'
  })
}

export function putObj(obj) {
  return request({
    url: '/api/manager/warehouse-position/' + obj.id,
    method: 'put',
    data: obj
  })
}

export function updateStatus(id, status) {
  return request({
    url: '/api/manager/warehouse-position/updateStatus?id=' + id + "&status=" + status,
    method: 'post'
  })
}
