import request from '@/router/axios'
import Vue from "vue"
export function page(query) {
  if(query){
    query = Vue.prototype.filterObjSpace(query);
  }
  return request({
    url: '/api/manager/supplier-type/page',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return request({
    url: '/api/manager/supplier-type',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/api/manager/supplier-type/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return request({
    url: '/api/manager/supplier-type/'+ id,
    method: 'delete'
  })
}

export function putObj(obj) {
  return request({
    url: '/api/manager/supplier-type/' + obj.id,
    method: 'put',
    data: obj
  })
}


export function batchUpdate(ids, obj) {
  return request({
    url: '/api/manager/supplier-type/batchUpdate?ids=' + ids,
    method: 'put',
    data: obj
  })
}


export function updateStatus(ids, status) {
  return request({
    url: '/api/manager/supplier-type/updateStatus?ids=' + ids + "&status=" + status,
    method: 'post'
  })
}

export function getUsers(id) {
  return request({
    url: '/api/manager/supplier-type/' + id + '/user',
    method: 'get'
  });
}
