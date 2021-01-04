import request from '@/router/axios'
import Vue from "vue"
export function selectPage(query) {
  if(query){
    query = Vue.prototype.filterObjSpace(query);
  }
  return request({
    url: '/api/mall/oms-order-return-apply/selectPage',
    method: 'get',
    params: query
  })
}

export function getApplyDetail(id) {
  return request({
    url: '/api/mall/oms-order-return-apply/' + id,
    method: 'get'
  })
}

export function updateApplyStatus(obj) {
  return request({
    url: '/api/mall/oms-order-return-apply/updateApplyStatus',
    method: 'post',
    data: obj
  })
}

export function deleteApply(obj) {
  return request({
    url: '/api/mall/oms-order-return-apply/delete',
    method: 'post',
    data: obj
  })
}
