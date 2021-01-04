import request from '@/router/axios'
import Vue from "vue"
export function selectPage(query) {
  if(query){
    query = Vue.prototype.filterObjSpace(query);
  }
  return request({
    url: '/api/manager/purchase-order-change/selectPage',
    method: 'get',
    params: query
  })
}

export function selectPageByItem(query) {
  if(query){
    query = Vue.prototype.filterObjSpace(query);
  }
  return request({
    url: '/api/manager/purchase-order-change/selectPageByItem',
    method: 'get',
    params: query
  })
}

export function tempAddBill(obj) {
  return request({
    url: '/api/manager/purchase-order-change/tempAddBill',
    method: 'post',
    data: obj
  })
}

export function addBill(obj) {
  return request({
    url: '/api/manager/purchase-order-change/addBill',
    method: 'post',
    data: obj
  })
}

export function getBill(id) {
  return request({
    url: '/api/manager/purchase-order-change/getBill?id=' + id,
    method: 'get'
  })
}

export function selectPay(id) {
    return request({
        url: '/api/manager/project-pay/selectPay?id=' + id,
        method: 'get'
    })
}


export function pageAll() {
    return request({
        url: '/api/manager/register-type/pageAll',
        method: 'get'
    })
}

export function batchDelBill(ids) {
  return request({
    url: '/api/manager/purchase-order-change/batchDelBill?ids=' + ids,
    method: 'delete'
  })
}


export function auditBill(obj) {
  return request({
    url: '/api/manager/purchase-order-change/auditBill',
      method: 'post',
      data: obj
  })
}
