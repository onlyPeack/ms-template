import request from '@/router/axios'
import Vue from "vue"
export function selectPage(query) {
  if(query){
    query = Vue.prototype.filterObjSpace(query);
  }
  return request({
    url: '/api/mall/scs-company/selectPage',
    method: 'get',
    params: query
  })
}

export function deleteCompany(obj) {
  return request({
    url: '/api/mall/scs-company/delete',
    method: 'post',
    data: obj
  })
}

export function addCompany(obj) {
  return request({
    url: '/api/mall/scs-company/add',
    method: 'post',
    data: obj
  })
}

export function getCompanyDetail(id) {
  return request({
    url: '/api/mall/scs-company/' + id,
    method: 'get'
  })
}

export function updateCompany(obj) {
  return request({
    url: '/api/mall/scs-company/update',
    method: 'post',
    data: obj
  })
}
