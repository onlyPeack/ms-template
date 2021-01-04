import request from '@/router/axios'
import Vue from "vue"
export function page(query) {
  if(query){
    query = Vue.prototype.filterObjSpace(query);
  }
  return request({
    url: '/api/manager/account/page',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return request({
    url: '/api/manager/account',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/api/manager/account/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return request({
    url: '/api/manager/account/' + id,
    method: 'delete'
  })
}

export function putObj(id, obj) {
  return request({
    url: '/api/manager/account/' + id,
    method: 'put',
    data: obj
  })
}

export function updateStatus(id, status) {
    return request({
        url: '/api/manager/account/updateStatus?id=' + id + "&status=" + status,
        method: 'post'
    })
}
