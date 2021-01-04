import request from '@/router/axios'
import Vue from "vue"
export function page(query) {
  if(query){
    query = Vue.prototype.filterObjSpace(query);
  }
  return request({
    url: '/api/manager/supplier/page',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return request({
    url: '/api/manager/supplier',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/api/manager/supplier/' + id,
    method: 'get'
  })
}

export function batchDel(ids) {
  return request({
    url: '/api/manager/supplier/batchDel?ids=' + ids,
    method: 'delete'
  })
}

export function putObj(id, obj) {
  return request({
    url: '/api/manager/supplier/' + id,
    method: 'put',
    data: obj
  })
}


export function batchUpdate(ids, obj) {
  return request({
    url: '/api/manager/supplier/batchUpdate?ids=' + ids,
    method: 'put',
    data: obj
  })
}


export function updateStatus(ids, status) {
  return request({
    url: '/api/manager/supplier/updateStatus?ids=' + ids + "&status=" + status,
    method: 'post'
  })
}

export function getUsers(id) {
  return request({
    url: '/api/manager/supplier/' + id + '/user',
    method: 'get'
  });
}
export function supplierType() {
    return request({
        url: '/api/manager/supplier-type/pageAll',
        method: 'get'
    });
}

export function checkName(supplierName,id) {
    if(id == '' || id == undefined || id == null){
        return request({
            url: '/api/manager/supplier/checkName?supplierName=' + supplierName,
            method: 'get'
        })
    }else{
        return request({
            url: '/api/manager/supplier/checkName?supplierName=' + supplierName+'&id='+id,
            method: 'get'
        })
    }

}
