import request from '@/router/axios'
import Vue from "vue"
export function selectPage(query) {
  if(query){
    query = Vue.prototype.filterObjSpace(query);
  }
  return request({
    url: '/api/purchase/purchase-contract/selectPage',
    method: 'get',
    params: query
  })
}

export function selectPageByItem(query) {
  if(query){
    query = Vue.prototype.filterObjSpace(query);
  }
  return request({
    url: '/api/purchase/purchase-contract/selectPageByItem',
    method: 'get',
    params: query
  })
}

export function tempAddBill(obj) {
  return request({
    url: '/api/purchase/purchase-contract/tempAddBill',
    method: 'post',
    data: obj
  })
}

export function addBill(obj) {
  return request({
    url: '/api/purchase/purchase-contract/addBill',
    method: 'post',
    data: obj
  })
}

export function getBill(id) {
  return request({
    url: '/api/purchase/purchase-contract/getBill?id=' + id,
    method: 'get'
  })
}

export function batchDelBill(ids) {
  return request({
    url: '/api/purchase/purchase-contract/batchDelBill?ids=' + ids,
    method: 'delete'
  })
}

export function auditBill(obj) {
  return request({
    url: '/api/purchase/purchase-contract/auditBill',
    method: 'post',
    data: obj
  })
}

export function download(id) {
  return request({
    url: '/api/purchase/purchase-contract/download?id=' + id,
    method: 'get'
  })
}
