import request from '@/router/axios'
import Vue from "vue"
export function selectPage(query) {
  if(query){
    query = Vue.prototype.filterObjSpace(query);
  }
  return request({
    url: '/api/manager/sales-quotation/selectPage',
    method: 'get',
    params: query
  })
}
export function selectAll(query) {
    if(query){
        query = Vue.prototype.filterObjSpace(query);
    }
    return request({
        url: '/api/manager/project-contract/selectAll',
        method: 'get',
        params: query
    })
}

export function selectPageByItem(query) {
  if(query){
    query = Vue.prototype.filterObjSpace(query);
  }
  return request({
    url: '/api/manager/sales-quotation/selectPageByItem',
    method: 'get',
    params: query
  })
}

export function tempAddBill(obj) {
  return request({
    url: '/api/manager/sales-quotation/tempAddBill',
    method: 'post',
    data: obj
  })
}

export function addBill(obj) {
  return request({
    url: '/api/manager/sales-quotation/addBill',
    method: 'post',
    data: obj
  })
}

export function getBill(id) {
  return request({
    url: '/api/manager/sales-quotation/getBill?id=' + id,
    method: 'get'
  })
}

export function batchDelBill(ids) {
  return request({
    url: '/api/manager/sales-quotation/batchDelBill?ids=' + ids,
    method: 'delete'
  })
}


export function auditBill(obj) {
  return request({
    url: '/api/manager/sales-quotation/auditBill',
    method: 'post',
    data: obj
  })
}
