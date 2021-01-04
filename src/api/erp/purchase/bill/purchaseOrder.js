import request from '@/router/axios'
import Vue from "vue"
export function selectPage(query) {
  if(query){
    query = Vue.prototype.filterObjSpace(query);
  }
  return request({
    url: '/api/manager/purchase-order/selectPage',
    method: 'get',
    params: query
  })
}

export function contractPrint(id) {
    return request({
        url: '/api/manager/purchase-order/print/'+ id,
        method: 'get',
    })
}

export function selectPageByItem(query) {
  if(query){
    query = Vue.prototype.filterObjSpace(query);
  }
  return request({
    url: '/api/manager/purchase-order/selectPageByItem',
    method: 'get',
    params: query
  })
}

export function tempAddBill(obj) {
  return request({
    url: '/api/manager/purchase-order/tempAddBill',
    method: 'post',
    data: obj
  })
}

export function addBill(obj) {
  return request({
    url: '/api/manager/purchase-order/addBill',
    method: 'post',
    data: obj
  })
}

export function getBill(id) {
  return request({
    url: '/api/manager/purchase-order/getBill?id=' + id,
    method: 'get'
  })
}

export function batchDelBill(ids) {
  return request({
    url: '/api/manager/purchase-order/batchDelBill?ids=' + ids,
    method: 'delete'
  })
}


export function auditBill(obj) {
  return request({
    url: '/api/manager/purchase-order/auditBill',
    method: 'post',
    data: obj
  })
}

export function orderTrack(query) {
  if(query){
    query = Vue.prototype.filterObjSpace(query);
  }
  return request({
    url: '/api/manager/purchase-order/orderTrack',
    method: 'get',
    params: query
  })
}

export function orderItemTrack(id) {

  return request({
    url: '/api/manager/purchase-order/orderItemTrack/'+id,
    method: 'get',
  })
}
