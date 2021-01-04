import request from '@/router/axios'
import Vue from "vue"
export function page(query) {
  if(query){
    query = Vue.prototype.filterObjSpace(query);
  }
  return request({
    url: '/api/manager/creditReturn/selectByPageRe',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return request({
    url: '/api/manager/creditReturn',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/api/manager/creditReturn/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return request({
    url: '/api/manager/creditReturn/' + id,
    method: 'delete'
  })
}

export function putObj(id, obj) {
  return request({
    url: '/api/manager/creditReturn/' + id,
    method: 'put',
    data: obj
  })
}

export function addBill(obj) {
  return request({
    url: '/api/manager/creditReturn/addBill',
    method: 'post',
    data: obj
  })
}

export function auditBill(obj) {
  return request({
    url: '/api/manager/creditReturn/auditBill',
    method: 'post',
    data: obj
  })
}
export function deleteBill(id) {
  return request({
    url: '/api/manager/creditReturn/deleteBill/?id=' + id,
    method: 'post'
  })
}

export function queryAmount(code) {
  return request({
    url: '/api/financial/financial-capital-account/queryAmount?accountCode=' + code + '&type=2',
    method: 'get'
  })
}
