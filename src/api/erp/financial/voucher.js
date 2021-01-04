import request from '@/router/axios'
import Vue from "vue"
export function getDetailPage(query) {
  if(query){
    query = Vue.prototype.filterObjSpace(query);
  }
  return request({
    url: '/api/financial/voucher/page',
    method: 'get',
    params: query
  })
}

export function getMainList(query) {
  if(query){
    query = Vue.prototype.filterObjSpace(query);
  }
  return request({
    url: '/api/financial/explanation/page',
    method: 'get',
    params: query
  })
}

export function getSubjectList(query) {
  if(query){
    query = Vue.prototype.filterObjSpace(query);
  }
  return request({
    url: '/api/financial/account/page',
    method: 'get',
    params: query
  })
}

export function getWordList(query) {
  if(query){
    query = Vue.prototype.filterObjSpace(query);
  }
  return request({
    url: '/api/financial/voucherGroup/page',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return request({
    url: '/api/financial/voucher',
    method: 'post',
    data: obj
  })
}
export function getObj(id) {
  return request({
    url: '/api/financial/voucher/' + id,
    method: 'get'
  })
}
export function putObj(id, obj) {
  return request({
    url: '/api/financial/voucher/' + id,
    method: 'put',
    data: obj
  })
}
export function delObj(id) {
  return request({
    url: '/api/financial/voucher/' + id,
    method: 'delete'
  })
}
