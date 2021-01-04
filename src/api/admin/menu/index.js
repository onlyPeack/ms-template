import request from '@/router/axios';
import Vue from "vue";
export function fetchTree(query) {
  return request({
    url: '/api/admin/menu/tree',
    method: 'get',
    params: query
  })
}

export function fetchAll() {
  return request({
    url: '/api/admin/menu/all',
    method: 'get'
  })
}
export function addObj(obj) {
  return request({
    url: '/api/admin/menu/addRe',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/api/admin/menu/selectById/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return request({
    url: '/api/admin/menu/' + id,
    method: 'delete'
  })
}

export function putObj(id, obj) {
  return request({
    url: '/api/admin/menu/' + id,
    method: 'put',
    data: obj
  })
}

export function fetchAllParent() {
  return request({
    url: '/api/admin/menu/allParent',
    method: 'get'
  })
}

export function add(obj) {
  return request({
    url: '/api/admin/menu/add',
    method: 'post',
    data: obj
  })
}

export function allUsedMenu() {
  return request({
    url: '/api/admin/menu/allUsedMenu',
    method: 'get'
  })
}
