import request from '@/router/axios'
import Vue from "vue"
export function page(query) {
  if(query){
    query = Vue.prototype.filterObjSpace(query);
  }
  return request({
    url: '/api/manager/brand/page',
    method: 'get',
    params: query
  })
}

export function allBrand() {
  return request({
    url: '/api/manager/brand/allBrand',
    method: 'get',
  })
}

export function addObj(obj) {
  return request({
    url: '/api/manager/brand',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/api/manager/brand/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return request({
    url: '/api/manager/brand/' + id,
    method: 'delete'
  })
}
export function getObjs(id) {
  return request({
    url: '/api/mall/home/brand/' + id,
    method: 'get'
  })
}
export function putObj(obj) {
  return request({
    url: '/api/manager/brand/' + obj.id,
    method: 'put',
    data: obj
  })
}

export function pageBycategoryId(id) {
  return request({
    url: '/api/manager/brand/selectByCategoryId' + id,
    method: 'get'
  })
}
