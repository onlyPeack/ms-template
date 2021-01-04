import request from '@/router/axios'
import Vue from "vue"
export function selectPage(query) {
  if(query){
    query = Vue.prototype.filterObjSpace(query);
  }
  return request({
    url: '/api/sales/sales-delivery-goods-notice/selectPage',
    method: 'get',
    params: query
  })
}

export function selectPageByItem(query) {
  if(query){
    query = Vue.prototype.filterObjSpace(query);
  }
  return request({
    url: '/api/sales/sales-delivery-goods-notice/selectPageByItem',
    method: 'get',
    params: query
  })
}

export function tempAddBill(obj) {
  return request({
    url: '/api/sales/sales-delivery-goods-notice/tempAddBill',
    method: 'post',
    data: obj
  })
}

export function addBill(obj) {
  return request({
    url: '/api/sales/sales-delivery-goods-notice/addBill',
    method: 'post',
    data: obj
  })
}

export function getBill(id) {
  return request({
    url: '/api/sales/sales-delivery-goods-notice/getBill?id=' + id,
    method: 'get'
  })
}

export function batchDelBill(ids) {
  return request({
    url: '/api/sales/sales-delivery-goods-notice/batchDelBill?ids=' + ids,
    method: 'delete'
  })
}


export function auditBill(id, status) {
  return request({
    url: '/api/sales/sales-delivery-goods-notice/auditBill?id=' + id + "&status=" + status,
    method: 'post'
  })
}
