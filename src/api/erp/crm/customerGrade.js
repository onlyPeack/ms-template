import request from '@/router/axios'
import Vue from "vue"
export function page(query) {
  if(query){
    query = Vue.prototype.filterObjSpace(query);
  }
  return request({
    url: '/api/manager/customer-grade/page',
    method: 'get',
    params: query
  })
}

export function pageAll(query) {
  if(query){
    query = Vue.prototype.filterObjSpace(query);
  }
  return request({
    url: '/api/manager/customer-grade/pageAll',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return request({
    url: '/api/manager/customer-grade',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/api/manager/customer-grade/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return request({
    url: '/api/manager/customer-grade/' + id,
    method: 'delete'
  })
}

export function putObj(obj) {
  return request({
    url: '/api/manager/customer-grade/' + obj.id,
    method: 'put',
    data: obj
  })
}
export function pushToMall(ids) {
    return request({
        url: '/api/manager/customer/pushToMall?ids=' + ids,
        method: 'get'
    })
}