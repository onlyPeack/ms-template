import request from '@/router/axios'
import Vue from "vue"
export function page(query) {
  if(query){
    query = Vue.prototype.filterObjSpace(query);
  }
  return request({
    url: '/api/manager/customerRegister/pageRe',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return request({
    url: '/api/manager/customerRegister',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/api/manager/customerRegister/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return request({
    url: '/api/manager/customerRegister/' + id,
    method: 'delete'
  })
}

export function putObj(id, obj) {
  return request({
    url: '/api/manager/customerRegister/' + id,
    method: 'put',
    data: obj
  })
}

export function addBill(obj) {
  return request({
    url: '/api/manager/customerRegister/addBill',
    method: 'post',
    data: obj
  })
}

export function auditBill(obj) {
  return request({
    url: '/api/manager/customerRegister/auditBill',
    method: 'post',
    data: obj
  })
}
export function deleteBill(id) {
  return request({
    url: '/api/manager/customerRegister/deleteBill/?id=' + id,
    method: 'post'
  })
}
