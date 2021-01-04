import request from '@/router/axios'
import Vue from "vue"
export function page(query) {
  if(query){
    query = Vue.prototype.filterObjSpace(query);
  }
  return request({
    url: '/api/manager/customer/page',
    method: 'get',
    params: query
  })
}

export function pagePublicPool(query) {
  return request({
    url: '/api/manager/customer/pagePublicPool',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return request({
    url: '/api/manager/customer',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/api/manager/customer/' + id,
    method: 'get'
  })
}

export function batchDel(ids) {
  return request({
    url: '/api/manager/customer/batchDel?ids=' + ids,
    method: 'delete'
  })
}


export function checkName(customerName,id) {
  if(id == '' || id == undefined || id == null){
      return request({
          url: '/api/manager/customer/checkName?customerName=' + customerName,
          method: 'get'
      })
  }else{
      return request({
          url: '/api/manager/customer/checkName?customerName=' + customerName+'&id='+id,
          method: 'get'
      })
  }

}

export function putObj(id, obj) {
  return request({
    url: '/api/manager/customer/' + id,
    method: 'put',
    data: obj
  })
}


export function batchUpdate(ids, obj) {
  return request({
    url: '/api/manager/customer/batchUpdate?ids=' + ids,
    method: 'put',
    data: obj
  })
}


export function updateStatus(ids, status) {
  return request({
    url: '/api/manager/customer/updateStatus?ids=' + ids + "&status=" + status,
    method: 'post'
  })
}

export function getUsers(id) {
  return request({
    url: '/api/manager/customer/' + id + '/user',
    method: 'get'
  });
}
export function addAddressObj(obj) {
  return request({
    url: '/api/manager/receiveAddress',
    method: 'post',
    data: obj
  })
}

export function getAddressPage(query) {
  return request({
    url: '/api/manager/receiveAddress/page',
    method: 'get',
    params: query
  })
}

export function putAddressObj(id, obj) {
  return request({
    url: '/api/manager/receiveAddress/' + id,
    method: 'put',
    data: obj
  })
}

export function delAddress(id) {
  return request({
    url: '/api/manager/receiveAddress/' + id,
    method: 'delete'
  })
}

export function generatingPublicPool(id) {
  return request({
    url: '/api/manager/customer/generatingPublicPool?timeInterval=' + id,
    method: 'put'
  })
}

export function reallocate(ids, obj) {
  return request({
    url: '/api/manager/customer/reallocate?ids=' + ids,
    method: 'put',
    data: obj
  })
}

export function selectArea() {
    return request({
        url: '/api/manager/customer/selectArea',
        method: 'get',
    })
}