import request from '@/router/axios'
import Vue from "vue"
export function selectPage(query) {
  if(query){
    query = Vue.prototype.filterObjSpace(query);
  }
  return request({
    url: '/api/mall/oms-order/selectPage',
    method: 'get',
    params: query
  })
}

export function getOrderDetail(id) {
  return request({
    url: '/api/mall/oms-order/' + id,
    method: 'get'
  })
}

export function updateReceiverInfo(obj) {
  return request({
    url: '/api/mall/oms-order/updateReceiver',
    method: 'post',
    data: obj
  })
}

export function updateOrderNote(obj) {
  return request({
    url: '/api/mall/oms-order/updateNote',
    method: 'post',
    data: obj
  })
}


export function closeOrder(obj) {
  return request({
    url: '/api/mall/oms-order/update/close',
    method: 'post',
    data: obj
  })
}

export function deleteOrder(obj) {
  return request({
    url: '/api/mall/oms-order/delete',
    method: 'post',
    data: obj
  })
}

export function auditOrder(obj) {
  return request({
    url: '/api/mall/oms-order/auditOrder',
    method: 'post',
    data: obj
  })
}


export function updateOrderLabel(obj) {
  return request({
    url: '/api/mall/oms-order/updateOrderLabel',
    method: 'post',
    data: obj
  })
}

export function deliverMainOrder(obj, note) {
  return request({
    url: `/api/mall/oms-order/deliverMainOrder?masterOrderSns=${obj}&note=${note}`,
    method: 'post'
  })
}


export function deliverSubOrder(obj, note) {
  return request({
    url: `/api/mall/oms-order/deliverSubOrder?orderSns=${obj}&note=${note}`,
    method: 'post'
  })
}

export function cancelFutureOrderPart(obj) {
  return request({
    url: '/api/mall/oms-order/cancelFutureOrderPart',
    method: 'post',
    data: obj
  })
}
export function closeNowOrderSub(obj) {
  return request({
    url: '/api/mall/oms-order/closeNowOrderSub',
    method: 'post',
    data: obj
  })
}

export function closeOrderFull(obj) {
  return request({
    url: '/api/mall/oms-order/closeOrderFull',
    method: 'post',
    data: obj
  })
}

export  function checkLogistics(logisticsName,logisticsNo) {
 return request({
   url: `/api/mall/oms-order/logistics?logisticsName=${logisticsName}&logisticsNo=${logisticsNo}`,
   method: 'get'
 })
}

