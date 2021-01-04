import request from '@/router/axios';
import Vue from "vue"
export function page(query) {
  if(query){
    query = Vue.prototype.filterObjSpace(query);
  }
  return request({
    url: '/api/admin/tenant/page',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return request({
    url: '/api/admin/tenant',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/api/admin/tenant/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return request({
    url: '/api/admin/tenant/' + id,
    method: 'delete'
  })
}

export function putObj(id, obj) {
  return request({
    url: '/api/admin/tenant/' + id,
    method: 'put',
    data: obj
  })
}

export function updateUser(id, obj) {
  return request({
    url: '/api/admin/tenant/' + id + '/user',
    method: 'put',
    params: obj
  })
}

export function getOwner(id) {
  return request({
    url: '/api/admin/tenant/' + id + '/user',
    method: 'get'
  });
}

export function forbidden(id){
    return request({
        url: '/api/admin/tenant/' + id + '/forbidden',
        method: 'get'
    });
}
export function pass(id){
    return request({
        url: '/api/admin/tenant/' + id + '/pass  ',
        method: 'get'
    });
}

export function queryTenantDetail(id){
    return request({
        url: '/api/admin/tenant/queryTenantDetail?tenantId='+id,
        method: 'get'
    });
}

export function checkTenant(tenantId,status){
    return request({
        url: `/api/admin/tenant/checkTenant?tenantId=${tenantId}&status=${status}`,
        method: 'get'
    });
}
export function pages(query){
    return request({
        url: `/api/manager/tenant-service-order/queryAllOrders`,
        method: 'get',
        params: query
    });
}
export function transactionRecordsPage(query){
    return request({
        url: `/api/manager/tenant-service-order/transactionRecordsPage`,
        method: 'get',
        params: query
    });
}
export function tatisticsTransactionRecords(query){
    return request({
        url: `/api/manager/tenant-service-order/statisticsTransactionRecords`,
        method: 'get',
        params: query
    });
}

export function invoiceManage(tenantId){
    return request({
        url: `/api/manager/tenant-service-invoice/invoiceManage?tenantId=${tenantId}`,
        method: 'get',
    });
}

export function addInvoiceManage(query){
    return request({
        url: `/api/managertenant-service-invoice/add`,
        method: 'post',
        data:query
    });
}

export function selectPage(query){
    return request({
        url: `/api/manager/tenant-service-invoice/selectPage`,
        method: 'get',
        params:query
    });
}




