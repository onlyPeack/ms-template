import request from '@/router/axios'
import Vue from "vue"
export function page(query) {
  if(query){
    query = Vue.prototype.filterObjSpace(query);
  }
  return request({
    url: '/api/manager/logistics/page',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return request({
    url: '/api/manager/logistics',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/api/manager/logistics/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return request({
    url: '/api/manager/logistics/' + id,
    method: 'delete'
  })
}

export function putObj(obj) {
  return request({
    url: '/api/manager/logistics/' + obj.id,
    method: 'put',
    data: obj
  })
}

export function start(id) {
    return request({
        url: '/api/manager/logistics/start/' + id,
        method: 'put'
    })
}

export function stop(id) {
    return request({
        url: '/api/manager/logistics/stop/' + id,
        method: 'put'
    })
}
export function updateStatus(id, status) {
    return request({
        url: '/api/manager/logistics/updateStatus?id=' + id + "&status=" + status,
        method: 'post'
    })
}


