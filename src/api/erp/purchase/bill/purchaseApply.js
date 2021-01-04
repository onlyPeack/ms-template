import request from '@/router/axios'
import Vue from "vue"
export function selectPage(query) {
  if(query){
    query = Vue.prototype.filterObjSpace(query);
  }
  return request({
    url: '/api/manager/purchase-apply/selectPage',
    method: 'get',
    params: query
  })
}

export function selectPageByItem(query) {
  if(query){
    query = Vue.prototype.filterObjSpace(query);
  }
  return request({
    url: '/api/manager/purchase-apply/selectPageByItem',
    method: 'get',
    params: query
  })
}

export function tempAddBill(obj) {
  return request({
    url: '/api/manager/purchase-apply/tempAddBill',
    method: 'post',
    data: obj
  })
}

export function addBill(obj) {
  return request({
    url: '/api/manager/purchase-apply/addBill',
    method: 'post',
    data: obj
  })
}

export function getBill(id) {
  return request({
    url: '/api/manager/purchase-apply/getBill?id=' + id,
    method: 'get'
  })
}

export function batchDelBill(ids) {
  return request({
    url: '/api/manager/purchase-apply/batchDelBill?ids=' + ids,
    method: 'delete'
  })
}

export function cancel(ids) {
    return request({
        url: '/api/manager/purchase-apply/cancel/' + ids,
        method: 'get'
    })
}

export function auditBill(obj) {
  return request({
    url: '/api/manager/purchase-apply/auditBill',
    method: 'post',
    data: obj
  })
}
