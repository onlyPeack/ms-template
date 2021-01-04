import request from '@/router/axios'
import Vue from "vue"
export function page(query) {
  if(query){
    query = Vue.prototype.filterObjSpace(query);
  }
  return request({
    url: '/api/purchase/supplier-credit-return/selectByPageRe',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return request({
    url: '/api/purchase/supplier-credit-return',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/api/purchase/supplier-credit-return/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return request({
    url: '/api/purchase/supplier-credit-return/' + id,
    method: 'delete'
  })
}

export function putObj(id, obj) {
  return request({
    url: '/api/purchase/supplier-credit-return/' + id,
    method: 'put',
    data: obj
  })
}

export function addBill(obj) {
  return request({
    url: '/api/purchase/supplier-credit-return/addBill',
    method: 'post',
    data: obj
  })
}

export function auditBill(obj) {
  return request({
    url: '/api/purchase/supplier-credit-return/auditBill',
    method: 'post',
    data: obj
  })
}
export function deleteBill(id) {
  return request({
    url: '/api/purchase/supplier-credit-return/deleteBill/?id=' + id,
    method: 'post'
  })
}

export function queryAmount(code) {
  return request({
    url: '/api/financial/financial-capital-account/queryAmount?accountCode=' + code + '&type=3',
    method: 'get'
  })
}
