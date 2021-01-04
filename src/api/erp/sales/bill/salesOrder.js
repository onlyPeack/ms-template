import request from '@/router/axios'
import Vue from "vue"
export function selectPage(query) {
  if(query){
    query = Vue.prototype.filterObjSpace(query);
  }
  return request({
    url: '/api/manager/sales-order/selectPage',
    method: 'get',
    params: query
  })
}

export function selectGoodsPage(query) {
    if(query){
        query = Vue.prototype.filterObjSpace(query);
    }
    return request({
        url: '/api/manager/goodsTaxCode/selectGoodsPage',
        method: 'get',
        params: query
    })
}
export function contractPrint(id) {
    return request({
        url: '/api/manager/sales-order/print/'+ id,
        method: 'get',
    })
}
export function lockStock(id) {
    return request({
        url: '/api/manager/sales-order/lockStock/'+ id,
        method: 'get',
    })
}
export function unlockStock(id) {
    return request({
        url: '/api/manager/sales-order/unlockStock/'+ id,
        method: 'get',
    })
}

export function middleType(query) {
    if(query){
        query = Vue.prototype.filterObjSpace(query);
    }
    return request({
        url: '/api/manager/purchase-order-sales-order-middle/selectByPage',
        method: 'get',
        params: query
    })
}

export function selectPageByItem(query) {
    if(query){
        query = Vue.prototype.filterObjSpace(query);
    }
    return request({
        url: '/api/manager/sales-order/selectPageByItem',
        method: 'get',
        params: query
    })
}

export function selectPageItemByWarehouseId(query) {
    if(query){
        query = Vue.prototype.filterObjSpace(query);
    }
    return request({
        url: '/api/manager/sales-order/selectPageItemByWarehouseId',
        method: 'get',
        params: query
    })
}

export function tempAddBill(obj) {
  return request({
    url: '/api/manager/sales-order/tempAddBill',
    method: 'post',
    data: obj
  })
}

export function addBill(obj) {
  return request({
    url: '/api/manager/sales-order/addBill',
    method: 'post',
    data: obj
  })
}

export function getBill(id) {
  return request({
    url: '/api/manager/sales-order/getBill?id=' + id,
    method: 'get'
  })
}

export function selectAllById(id) {
    return request({
        url: '/api/manager/project-contract/selectAllById?id=' + id,
        method: 'get'
    })
}


export function batchDelBill(ids) {
  return request({
    url: '/api/manager/sales-order/batchDelBill?ids=' + ids,
    method: 'delete'
  })
}

export function orderItemTracks(id) {
    return request({
        url: '/api/manager/sales-order/orderItemTrack/' + id,
        method: 'get'
    })
}


export function auditBill(obj) {
  return request({
    url: '/api/manager/sales-order/auditBill',
    method: 'post',
    data: obj
  })
}

export function orderTrack(query) {
  if(query){
    query = Vue.prototype.filterObjSpace(query);
  }
  return request({
    url: '/api/manager/sales-order/orderTrack',
    method: 'get',
    params: query
  })
}

export function orderItemTrack(query) {
  if(query){
    query = Vue.prototype.filterObjSpace(query);
  }
  return request({
    url: '/api/manager/sales-order/orderItemTrack',
    method: 'get',
    params: query
  })
}

export function selectMaterialStock(query) {
    if(query){
        query = Vue.prototype.filterObjSpace(query);
    }
    return request({
        url: '/api/manager/stock-detail/selectMaterialStock',
        method: 'get',
        params: query
    })
}

export function cancel(id) {
    return request({
        url: '/api/manager/sales-order/cancel/' + id,
        method: 'get'
    })
}
