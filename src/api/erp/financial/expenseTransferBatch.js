import request from '@/router/axios'
import Vue from "vue"
export function selectPage(query) {
  if(query){
    query = Vue.prototype.filterObjSpace(query);
  }
  return request({
    url: '/api/financial/expenseTransferBatch/selectPage',
    method: 'get',
    params: query
  })
}

export function selectPageByItem(query) {
  if(query){
    query = Vue.prototype.filterObjSpace(query);
  }
  return request({
    url: '/api/financial/expenseTransferBatch/selectPageByItem',
    method: 'get',
    params: query
  })
}

export function tempAddBill(obj) {
  return request({
    url: '/api/financial/expenseTransferBatch/tempAddBill',
    method: 'post',
    data: obj
  })
}

export function addBill(obj) {
  return request({
    url: '/api/financial/expenseTransferBatch/addBill',
    method: 'post',
    data: obj
  })
}

export function getBill(id) {
  return request({
    url: '/api/financial/expenseTransferBatch/getBill?id=' + id,
    method: 'get'
  })
}

export function batchDelBill(ids) {
  return request({
    url: '/api/financial/expenseTransferBatch/batchDelBill?ids=' + ids,
    method: 'delete'
  })
}


export function auditBill(obj) {
  return request({
    url: '/api/financial/expenseTransferBatch/auditBill',
    method: 'post',
    data: obj
  })
}

export function resetBill(id) {
  return request({
    url: '/api/financial/expenseTransferBatch/resetBill?id=' + id,
    method: 'get'
  })
}

export function exportFile() {
  return request({
    url: '/api/financial/expenseTransferBatch/exportFile',
    method: 'get',
    responseType: 'blob'
  })
}

export function importFile(obj) {
  return request({
    url: '/api/financial/expenseTransferBatch/importFile',
    method: 'post',
    data: obj
  })
}
