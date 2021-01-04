import request from '@/router/axios'
import Vue from "vue"
export function page(query) {
  if(query){
    query = Vue.prototype.filterObjSpace(query);
  }
  return request({
    url: '/api/purchase/supplier-credit-extension/selectByPageRe',
    method: 'get',
    params: query
  })
}

export function selectPage(query) {
  if(query){
    query = Vue.prototype.filterObjSpace(query);
  }
  return request({
    url: '/api/purchase/supplier-credit-extension/selectPage',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return request({
    url: '/api/purchase/supplier-credit-extension',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/api/purchase/supplier-credit-extension/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return request({
    url: '/api/purchase/supplier-credit-extension/' + id,
    method: 'delete'
  })
}

export function putObj(id, obj) {
  return request({
    url: '/api/purchase/supplier-credit-extension/' + id,
    method: 'put',
    data: obj
  })
}

export function addBill(obj) {
  return request({
    url: '/api/purchase/supplier-credit-extension/addBill',
    method: 'post',
    data: obj
  })
}

export function auditBill(obj) {
  return request({
    url: '/api/purchase/supplier-credit-extension/auditBill',
    method: 'post',
    data: obj
  })
}

export function deleteBill(id) {
  return request({
    url: '/api/purchase/supplier-credit-extension/deleteBill/?id=' + id,
    method: 'post'
  })
}

export function queryAmount(code) {
  return request({
    url: '/api/financial/financial-capital-account/queryAmount?accountCode=' + code + '&type=1',
    method: 'get'
  })
}
