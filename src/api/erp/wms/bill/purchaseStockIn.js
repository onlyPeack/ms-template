import request from '@/router/axios'
import Vue from "vue"
export function selectPage(query) {
  if(query){
    query = Vue.prototype.filterObjSpace(query);
  }
  return request({
    url: '/api/manager/purchase-stock-in/selectPage',
    method: 'get',
    params: query
  })
}

export function selectPageByItem(query) {
  if(query){
    query = Vue.prototype.filterObjSpace(query);
  }
  return request({
    url: '/api/manager/purchase-stock-in/selectPageByItem',
    method: 'get',
    params: query
  })
}

export function tempAddBill(obj) {
  return request({
    url: '/api/manager/purchase-stock-in/tempAddBill',
    method: 'post',
    data: obj
  })
}

export function addBill(obj) {
  return request({
    url: '/api/manager/purchase-stock-in/addBill',
    method: 'post',
    data: obj
  })
}

export function getBill(id) {
  return request({
    url: '/api/manager/purchase-stock-in/getBill?id=' + id,
    method: 'get'
  })
}

export function batchDelBill(ids) {
  return request({
    url: '/api/manager/purchase-stock-in/batchDelBill?ids=' + ids,
    method: 'delete'
  })
}


export function auditBill(obj) {
  return request({
    url: '/api/manager/purchase-stock-in/auditBill',
    method: 'post',
    data: obj
  })
}
