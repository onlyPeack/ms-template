import request from '@/router/axios'
import Vue from "vue"
export function selectPage(query) {
  if(query){
    query = Vue.prototype.filterObjSpace(query);
  }
  return request({
    url: '/api/manager/sales-stock-out/selectPage',
    method: 'get',
    params: query
  })
}

export function selectPageByItem(query) {
  if(query){
    query = Vue.prototype.filterObjSpace(query);
  }
  return request({
    url: '/api/manager/sales-stock-out/selectPageByItem',
    method: 'get',
    params: query
  })
}

export function tempAddBill(obj) {
  return request({
    url: '/api/manager/sales-stock-out/tempAddBill',
    method: 'post',
    data: obj
  })
}

export function addBill(obj) {
  return request({
    url: '/api/manager/sales-stock-out/addBill',
    method: 'post',
    data: obj
  })
}

export function getBill(id) {
  return request({
    url: '/api/manager/sales-stock-out/getBill?id=' + id,
    method: 'get'
  })
}

export function batchDelBill(ids) {
  return request({
    url: '/api/manager/sales-stock-out/batchDelBill?ids=' + ids,
    method: 'delete'
  })
}


export function auditBill(obj) {
  return request({
    url: '/api/manager/sales-stock-out/auditBill',
    method: 'post',
    data: obj
  })
}
export function electronicSurfaceSingle(id) {
    return request({
        url: '/api/manager/sales-stock-out/batchDelBill?id=' + id,
        method: 'delete'
    })
}
export function test() {
    return request({
        url: '/api/manager/project-data/test',
        method: 'post'
    })
}
export function selectExpressPage(query) {
    if(query){
        query = Vue.prototype.filterObjSpace(query);
    }
    return request({
        url: `/api/business/wms-express/page`,
        method: 'get',
        params: query
    })
}
export function selectArea() {
    return request({
        url: '/api/crm/customerCenter/selectArea',
        method: 'get'
    })
}

export function electronicSurfaceSingles(id) {
    return request({
        url: '/api/manager/sales-stock-out/exportNoodleSheet?id='+id,
        method: 'post'
    })
}
export function findLogisticsNo(id) {
    return request({
        url: '/api/manager/sales-stock-out/findLogisticsNo?id='+id,
        method: 'get',
    })
}
