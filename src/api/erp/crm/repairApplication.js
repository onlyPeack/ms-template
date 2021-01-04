import request from '@/router/axios'
import Vue from "vue"
export function selectPage(query) {
  if(query){
    query = Vue.prototype.filterObjSpace(query);
  }
  return request({
    url: '/api/manager/repairApplication/selectPage',
    method: 'get',
    params: query
  })
}

export function selectPageByItem(query) {
  return request({
    url: '/api/manager/repairApplication/selectPageByItem',
    method: 'get',
    params: query
  })
}

export function tempAddBill(obj) {
  return request({
    url: '/api/manager/repairApplication/tempAddBill',
    method: 'post',
    data: obj
  })
}

export function addBill(obj) {
  return request({
    url: '/api/manager/repairApplication/addBill',
    method: 'post',
    data: obj
  })
}

export function getBill(id) {
  return request({
    url: '/api/manager/repairApplication/getBill?id=' + id,
    method: 'get'
  })
}

export function batchDelBill(ids) {
  return request({
    url: '/api/manager/repairApplication/batchDelBill?ids=' + ids,
    method: 'delete'
  })
}


export function auditBill(obj) {
  return request({
    url: '/api/manager/repairApplication/auditBill',
    method: 'post',
    data: obj
  })
}
export function resetBill(id) {
  return request({
    url: '/api/manager/repairApplication/resetBill?id=' + id,
    method: 'get'
  })
}
