import request from '@/router/axios'
import Vue from "vue"
import da from "element-ui/src/locale/lang/da";
export function page(query) {
  if(query){
    query = Vue.prototype.filterObjSpace(query);
  }
  return request({
    url: '/api/manager/series/page',
    method: 'get',
    params: query
  })
}

export function pageAll(query) {
  if(query){
    query = Vue.prototype.filterObjSpace(query);
  }
  return request({
    url: '/api/manager/series/pageAll',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return request({
    url: '/api/manager/series',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/api/manager/series/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return request({
    url: '/api/manager/series/' + id,
    method: 'delete'
  })
}

export function putObj(obj) {
  return request({
    url: '/api/manager/series/' + obj.id,
    method: 'put',
    data: obj
  })
}

export function start(id) {
    return request({
        url: '/api/manager/series/start/' + id,
        method: 'put'
    })
}

export function stop(id) {
    return request({
        url: '/api/manager/series/stop/' + id,
        method: 'put'
    })
}
