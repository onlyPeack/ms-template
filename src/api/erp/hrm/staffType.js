import request from '@/router/axios'
import Vue from "vue"
export function page(query) {
  if(query){
    query = Vue.prototype.filterObjSpace(query);
  }
  return request({
    url: '/api/manager/staff-type/page',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return request({
    url: '/api/manager/staff-type',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/api/manager/staff-type/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return request({
    url: '/api/manager/staff-type/' + id,
    method: 'delete'
  })
}

export function putObj(id, obj) {
  return request({
    url: '/api/manager/staff-type/' + id,
    method: 'put',
    data: obj
  })
}


export function batchUpdate(ids, obj) {
  return request({
    url: '/api/manager/staff-type/batchUpdate?ids=' + ids,
    method: 'put',
    data: obj
  })
}


export function updateStatus(ids, status) {
  return request({
    url: '/api/manager/staff-type/updateStatus?ids=' + ids + "&status=" + status,
    method: 'post'
  })
}

export function getUsers(id) {
  return request({
    url: '/api/manager/staff-type/' + id + '/user',
    method: 'get'
  });
}
