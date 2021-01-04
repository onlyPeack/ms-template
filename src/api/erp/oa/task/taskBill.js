import request from '@/router/axios'
import Vue from "vue"
export function page(query) {
  if(query){
    query = Vue.prototype.filterObjSpace(query);
  }
  return request({
    url: '/api/oa/taskBill/page',
    method: 'get',
    params: query
  })
}

export function getProcessId(billPrefix) {
  return request({
    url: '/api/oa/taskBill/getProcessId',
    method: 'get',
    params: billPrefix
  })
}

export function itemPage(query) {
  if(query){
    query = Vue.prototype.filterObjSpace(query);
  }
  return request({
    url: '/api/oa/taskBill/itemPage',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return request({
    url: '/api/oa/taskBill',
    method: 'post',
    data: obj
  })
}
export function getObj(id) {
  return request({
    url: '/api/oa/taskBill/' + id,
    method: 'get'
  })
}

export function batchDelBill(ids) {
  return request({
    url: '/api/oa/taskBill/batchDelBill?ids=' + ids,
    method: 'delete'
  })
}

export function putObj(id, obj) {
  return request({
    url: '/api/oa/taskBill/' + id,
    method: 'put',
    data: obj
  })
}


export function getSourcePage(query) {
  if(query){
    query = Vue.prototype.filterObjSpace(query);
  }
  return request({
    url: '/api/oa/taskBill/getSourcePage',
    method: 'get',
    params: query
  })
}

export function copyTask(billPrefixList) {
  return request({
    url: '/api/oa/taskBill/copyTask?billPrefixList='+billPrefixList,
    method: 'post'
  })
}
