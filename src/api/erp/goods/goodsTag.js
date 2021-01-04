import request from '@/router/axios'
import Vue from "vue"
export function page(query) {
  if(query){
    query = Vue.prototype.filterObjSpace(query);
  }
  return request({
    url: '/api/manager/goodsTag/page',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return request({
    url: '/api/manager/goodsTag',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/api/manager/goodsTag/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return request({
    url: '/api/manager/goodsTag/' + id,
    method: 'delete'
  })
}

export function putObj(id, obj) {
  return request({
    url: '/api/manager/goodsTag/' + id,
    method: 'put',
    data: obj
  })
}

export function changeGoodsTag(id, tags) {
  return request({
    url: '/api/manager/goodsTag/changeGoodsTag?id=' + id + '&tags=' + tags,
    method: 'put'
  })
}
