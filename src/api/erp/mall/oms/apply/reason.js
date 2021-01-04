import request from '@/router/axios'
import Vue from "vue"
export function selectPage(query) {
  if(query){
    query = Vue.prototype.filterObjSpace(query);
  }
  return request({
    url: '/api/mall/oms-order-return-reason/selectPage',
    method: 'get',
    params: query
  })
}

export function deleteReason(obj) {
  return request({
    url: '/api/mall/oms-order-return-reason/delete',
    method: 'post',
    data: obj
  })
}

export function updateStatus(obj) {
  return request({
    url: '/api/mall/oms-order-return-reason/updateStatus',
    method: 'post',
    data: obj
  })
}

export function addReason(obj) {
  return request({
    url: '/api/mall/oms-order-return-reason/add',
    method: 'post',
    data: obj
  })
}

export function getReasonDetail(id) {
  return request({
    url: '/api/mall/oms-order-return-reason/' + id,
    method: 'get'
  })
}

export function updateReason(obj) {
  return request({
    url: '/api/mall/oms-order-return-reason/update',
    method: 'post',
    data: obj
  })
}
