import request from '@/router/axios'
import Vue from "vue"
export function selectPage(query) {
  if(query){
    query = Vue.prototype.filterObjSpace(query);
  }
  return request({
    url: '/api/manager/financial-sales-invoice/selectPage',
    method: 'get',
    params: query
  })
}

export function selectPageByItem(query) {
  if(query){
    query = Vue.prototype.filterObjSpace(query);
  }
  return request({
    url: '/api/manager/financial-sales-invoice/selectPageByItem',
    method: 'get',
    params: query
  })
}

export function tempAddBill(obj) {
  return request({
    url: '/api/manager/financial-sales-invoice/tempAddBill',
    method: 'post',
    data: obj
  })
}

export function getPrintData(deliverType,billNo) {
  return request({
    url: `/api/manager/financial-sales-invoice/getPrintData?deliverType=${deliverType}&billNo=${billNo}`,
    method: 'get',
  })
}
export function checkTaxCode(id) {
    return request({
        url: `/api/manager/financial-sales-invoice/checkTaxCode`,
        method: 'get',
    })
}
export function addBill(obj) {
  return request({
    url: '/api/manager/financial-sales-invoice/addBill',
    method: 'post',
    data: obj
  })
}

export function getBill(id) {
  return request({
    url: '/api/manager/financial-sales-invoice/getBill?id=' + id,
    method: 'get'
  })
}


export function batchDelBill(ids) {
  return request({
    url: '/api/manager/financial-sales-invoice/batchDelBill?ids=' + ids,
    method: 'delete'
  })
}


export function auditBill(obj) {
  return request({
    url: '/api/manager/financial-sales-invoice/auditBill',
    method: 'post',
    data: obj
  })
}

export function getInvoiceConfig() {
    return request({
        url: '/api/manager/general-configuration/getInvoiceConfig',
        method: 'get',
    })
}
