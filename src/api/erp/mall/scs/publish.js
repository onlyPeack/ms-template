import request from '@/router/axios'
import Vue from "vue"
export function selectPage(query) {
  if(query){
    query = Vue.prototype.filterObjSpace(query);
  }
  return request({
    url: '/api/mall/scs-publish/selectPage',
    method: 'get',
    params: query
  })
}

export function selectPageByItem(query) {
  if(query){
    query = Vue.prototype.filterObjSpace(query);
  }
  return request({
    url: '/api/mall/scs-publish/selectPageByItem',
    method: 'get',
    params: query
  })
}

export function tempAddBill(obj) {
  return request({
    url: '/api/mall/scs-publish/tempAddBill',
    method: 'post',
    data: obj
  })
}

export function addBill(obj) {
  return request({
    url: '/api/mall/scs-publish/addBill',
    method: 'post',
    data: obj
  })
}

export function getBill(obj) {
  return request({
    url: '/api/mall/scs-publish/getBill?id=' + obj,
    method: 'get'
  })
}

export function batchDelBill(ids) {
  return request({
    url: '/api/mall/scs-publish/batchDelBill?ids=' + ids,
    method: 'delete'
  })
}

export function auditBill(obj) {
  return request({
    url: '/api/mall/scs-publish/auditBill',
    method: 'post',
    data: obj
  })
}
