import request from '@/router/axios'
import Vue from "vue"
export function fetchTree(query) {
  if(query){
    query = Vue.prototype.filterObjSpace(query);
  }
  return request({
    url: '/api/oa/oaDocumentTree/tree',
    method: 'get',
    params: query
  })
}

export function fetchAll() {
  return request({
    url: '/api/oa/oaDocumentTree/all',
    method: 'get'
  })
}
export function addTreeObj(obj) {
  return request({
    url: '/api/oa/oaDocumentTree',
    method: 'post',
    data: obj
  })
}

export function getTreeObj(id) {
  return request({
    url: '/api/oa/oaDocumentTree/' + id,
    method: 'get'
  })
}

export function delTreeObj(id) {
  return request({
    url: '/api/oa/oaDocumentTree/' + id,
    method: 'delete'
  })
}

export function putTreeObj(id, obj) {
  return request({
    url: '/api/oa/oaDocumentTree/' + id,
    method: 'put',
    data: obj
  })
}
