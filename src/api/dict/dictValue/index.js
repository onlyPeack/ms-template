import request from '@/router/axios';
import Vue from "vue";
export function page(query) {
  if(query){
    query = Vue.prototype.filterObjSpace(query);
  }
  return request({
    url: '/api/dict/dictValue/page',
    method: 'get',
    params: query
  })
}

export function addValueObj(obj) {
  return request({
    url: '/api/dict/dictValue',
    method: 'post',
    data: obj
  })
}

export function getValueObj(id) {
  return request({
    url: '/api/dict/dictValue/' + id,
    method: 'get'
  })
}

export function delValueObj(id) {
  return request({
    url: '/api/dict/dictValue/' + id,
    method: 'delete'
  })
}

export function putValueObj(id, obj) {
  return request({
    url: '/api/dict/dictValue/' + id,
    method: 'put',
    data: obj
  })
}

export function getTypeValue(code) {
  return request({
    url: '/api/dict/dictValue/type/' + code,
    method: 'get'
  })
}

export function pageAll() {
    return request({
        url: '/api/manager/register-type/pageAll',
        method: 'get'
    })
}
