import request from '@/router/axios'
import Vue from "vue"
export function page(query) {
  if(query){
    query = Vue.prototype.filterObjSpace(query);
  }
  return request({
    url: '/api/manager/financial-payable-init/page',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return request({
    url: '/api/manager/financial-payable-init',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/api/manager/financial-payable-init/' + id,
    method: 'get'
  })
}

export function delObj(ids) {
  return request({
    url: '/api/manager/financial-payable-init/' + ids,
    method: 'delete'
  })
}

export function putObj(id, obj) {
  return request({
    url: '/api/manager/financial-payable-init/' + id,
    method: 'put',
    data: obj
  })
}

export function updateStatus(id, status) {
  return request({
    url: '/api/manager/financial-payable-init/updateStatus?id=' + id + "&status=" + status,
    method: 'post'
  })
}

export function endInit() {
  return request({
    url: '/api/manager/financial-payable-init/endInit',
    method: 'put'
  })
}

export function selectInitStatus() {
  return request({
    url: '/api/manager/financial-payable-init/selectInitStatus',
    method: 'get'
  })
}
