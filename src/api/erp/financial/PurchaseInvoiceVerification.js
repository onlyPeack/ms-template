import request from '@/router/axios'
import Vue from "vue"
export function selectPage(query) {
  if(query){
    query = Vue.prototype.filterObjSpace(query);
  }
  return request({
    url: '/api/manager/purchase-invoice-verification/selectPage',
    method: 'get',
    params: query
  })
}

export function selectPageByItem(query) {
  if(query){
    query = Vue.prototype.filterObjSpace(query);
  }
  return request({
    url: '/api/manager/purchase-invoice-verification/selectPageByItem',
    method: 'get',
    params: query
  })
}

export function tempAddBill(obj) {
  return request({
    url: '/api/manager/purchase-invoice-verification/tempAddBill',
    method: 'post',
    data: obj
  })
}

export function addBill(obj) {
  return request({
    url: '/api/manager/purchase-invoice-verification/addBill',
    method: 'post',
    data: obj
  })
}

export function getBill(id) {
  return request({
    url: '/api/manager/purchase-invoice-verification/getBill?id=' + id,
    method: 'get'
  })
}

export function cancel(id) {
    return request({
        url: '/api/manager/purchase-invoice-verification/cancel/' + id,
        method: 'get'
    })
}

export function batchDelBill(ids) {
  return request({
    url: '/api/manager/purchase-invoice-verification/batchDelBill?ids=' + ids,
    method: 'delete'
  })
}


export function auditBill(obj) {
  return request({
    url: '/api/manager/purchase-invoice-verification/auditBill',
    method: 'post',
    data: obj
  })
}
