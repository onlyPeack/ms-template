import request from '@/router/axios'
import Vue from "vue"
export function page(query) {
  if(query){
    query = Vue.prototype.filterObjSpace(query);
  }
  return request({
    url: '/api/hrm/staffEmployment/page',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return request({
    url: '/api/hrm/staffEmployment',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/api/hrm/staffEmployment/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return request({
    url: '/api/hrm/staffEmployment/' + id,
    method: 'delete'
  })
}

export function putObj(id, obj) {
  return request({
    url: '/api/hrm/staffEmployment/' + id,
    method: 'put',
    data: obj
  })
}
export function addBill(obj) {
  return request({
    url: '/api/hrm/staffEmployment/addBill',
    method: 'post',
    data: obj
  })
}

export function auditBill(obj) {
  return request({
    url: '/api/hrm/staffEmployment/auditBill',
    method: 'post',
    data: obj
  })
}

export function deleteBill(id) {
  return request({
    url: '/api/hrm/staffEmployment/deleteBill/?id=' + id,
    method: 'post'
  })
}
