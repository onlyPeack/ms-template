import request from '@/router/axios'
import Vue from "vue"
export function page(query) {
  if(query){
    query = Vue.prototype.filterObjSpace(query);
  }
  return request({
    url: '/api/oa/notice/page',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return request({
    url: '/api/oa/notice',
    method: 'post',
    data: obj
  })
}

export function addComment(obj) {
  return request({
    url: '/api/oa/dailyComment',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/api/oa/notice/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return request({
    url: '/api/oa/notice/' + id,
    method: 'delete'
  })
}

export function putObj(id, obj) {
  return request({
    url: '/api/oa/notice/' + id,
    method: 'put',
    data: obj
  })
}

export function readStatus(sourceId,toUser) {
  return request({
    url: '/api/oa/dailyUser?sourceId='+sourceId+'&toUser='+toUser,
    method: 'post',
  })
}

