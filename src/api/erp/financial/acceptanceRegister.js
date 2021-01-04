import request from '@/router/axios'
import Vue from "vue"
export function selectPage(query) {
  if(query){
    query = Vue.prototype.filterObjSpace(query);
  }
  return request({
    url: '/api/financial/financial-acceptance-register/selectPage',
    method: 'get',
    params: query
  })
}
export function findAllPage(query) {
  if(query){
    query = Vue.prototype.filterObjSpace(query);
  }
  return request({
    url: '/api/financial/financial-acceptance-register/findAllPage',
    method: 'get',
    params: query
  })
}
export function selectPageByItem(query) {
  if(query){
    query = Vue.prototype.filterObjSpace(query);
  }
  return request({
    url: '/api/financial/financial-acceptance-register/selectPageByItem',
    method: 'get',
    params: query
  })
}

export function tempAddBill(obj) {
  return request({
    url: '/api/financial/financial-acceptance-register/tempAddBill',
    method: 'post',
    data: obj
  })
}

export function addBill(obj) {
  return request({
    url: '/api/financial/financial-acceptance-register/addBill',
    method: 'post',
    data: obj
  })
}

export function getBill(id) {
  return request({
    url: '/api/financial/financial-acceptance-register/getBill?id=' + id,
    method: 'get'
  })
}

export function batchDelBill(ids) {
  return request({
    url: '/api/financial/financial-acceptance-register/batchDelBill?ids=' + ids,
    method: 'delete'
  })
}


export function auditBill(obj) {
  return request({
    url: '/api/financial/financial-acceptance-register/auditBill',
    method: 'post',
    data: obj
  })
}
