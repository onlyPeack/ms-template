import request from '@/router/axios'
import Vue from "vue"
export function page(query) {
  if(query){
    query = Vue.prototype.filterObjSpace(query);
  }
  return request({
    url: '/api/manager/contract-template/page',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return request({
    url: '/api/manager/contract-template',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/api/manager/contract-template/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return request({
    url: '/api/manager/contract-template/' + id,
    method: 'delete'
  })
}

export function putObj(obj) {
  return request({
    url: '/api/manager/contract-template/' + obj.id,
    method: 'put',
    data: obj
  })
}

export function updateStatus(ids, status) {
  return request({
    url: '/api/manager/contract-template/updateStatus?ids=' + ids + "&status=" + status,
    method: 'post'
  })
}

