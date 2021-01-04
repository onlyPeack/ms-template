import request from '@/router/axios'
import Vue from "vue"
export function page(query) {
  if(query){
    query = Vue.prototype.filterObjSpace(query);
  }
  return request({
    url: '/api/manager/payments-means/page',
    method: 'get',
    params: query
  })
}

export function pageAll() {
  return request({
    url: '/api/manager/payments-means/pageAll',
    method: 'get'
  })
}

export function addObj(obj) {
  return request({
    url: '/api/manager/payments-means',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/api/manager/payments-means/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return request({
    url: '/api/manager/payments-means/' + id,
    method: 'delete'
  })
}

export function putObj(obj) {
  return request({
    url: '/api/manager/payments-means/' + obj.id,
    method: 'put',
    data: obj
  })
}

export function updateStatus(id, status) {
  return request({
    url: '/api/manager/payments-means/updateStatus?id=' + id + '&status=' + status,
    method: 'post'
  })
}



export function allBrand() {
    return request({
        url: '/api/manager/brand/allBrand',
        method: 'get'
    })
}

export function selectByBrandId(id) {
    return request({
        url: '/api/manager/series/selectByBrandId/' +  id,
        method: 'get'
    })
}

