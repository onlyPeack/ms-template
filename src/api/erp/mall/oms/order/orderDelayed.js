import request from '@/router/axios'
import Vue from "vue"
export function page(query) {
  if(query){
    query = Vue.prototype.filterObjSpace(query);
  }
  return request({
    url: '/api/mall/omsOrderDelayed/page',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return request({
    url: '/api/mall/omsOrderDelayed',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/api/mall/omsOrderDelayed/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return request({
    url: '/api/mall/omsOrderDelayed/' + id,
    method: 'delete'
  })
}

export function putObj(id, obj) {
  return request({
    url: '/api/mall/omsOrderDelayed/' + id,
    method: 'put',
    data: obj
  })
}
export function addBill(obj) {
  return request({
    url: '/api/mall/omsOrderDelayed/addBill',
    method: 'post',
    data: obj
  })
}

export function auditBill(obj) {
  return request({
    url: '/api/mall/omsOrderDelayed/auditBill',
    method: 'post',
    data: obj
  })
}

export function deleteBill(id) {
  return request({
    url: '/api/mall/omsOrderDelayed/deleteBill/?id=' + id,
    method: 'post'
  })
}

export function delayedDeliver(orderSn, delayedDays, delayedReason) {
  return request({
    url: `/api/mall/oms-order/delayedDeliver?orderSn=${orderSn}&delayedDays=${delayedDays}&delayedReason=${delayedReason}`,
    method: 'post'
  })
}
