import request from '@/router/axios'
import Vue from "vue"
export function page(query) {
  if(query){
    query = Vue.prototype.filterObjSpace(query);
  }
  return request({
    url: '/api/financial/cost-ratio/page',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return request({
    url: '/api/financial/cost-ratio',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/api/financial/cost-ratio/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return request({
    url: '/api/financial/cost-ratio/' + id,
    method: 'delete'
  })
}

export function putObj(id, obj) {
  return request({
    url: '/api/financial/cost-ratio/' + id,
    method: 'put',
    data: obj
  })
}

export function updateStatus(id, status) {
  return request({
    url: '/api/financial/cost-ratio/updateStatus?id=' + id + "&status=" + status,
    method: 'post'
  })
}
