import request from '@/router/axios'
import Vue from "vue"
export function page(query) {
  if(query){
    query = Vue.prototype.filterObjSpace(query);
  }
  return request({
    url: '/api/financial/explanation/page',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return request({
    url: '/api/financial/explanation',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/api/financial/explanation/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return request({
    url: '/api/financial/explanation/' + id,
    method: 'delete'
  })
}

export function putObj(id, obj) {
  return request({
    url: '/api/financial/explanation/' + id,
    method: 'put',
    data: obj
  })
}

export function getExplanationCategoryList(query) {
  return request({
    url: '/api/financial/explanationCategory/page',
    method: 'get',
    params: query
  })
}
