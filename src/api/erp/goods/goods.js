import request from '@/router/axios'
import Vue from "vue"
export function page(query) {
  if(query){
    query = Vue.prototype.filterObjSpace(query);
  }
  return request({
    url: '/api/manager/goods/page',
    method: 'get',
    params: query
  })
}

export function selectGoodsBySeries(seriesName) {
  return request({
    url: '/api/manager/goods/selectGoodsBySeries?seriesName=' + seriesName,
    method: 'get'
  })
}

export function addGoods(obj) {
  return request({
    url: '/api/manager/goods/addGoods',
    method: 'post',
    data: obj
  })
}

export function updateGoods(obj) {
  return request({
    url: '/api/manager/goods/updateGoods',
    method: 'put',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/api/manager/goods/' + id,
    method: 'get'
  })
}

export function delObj(ids) {
  return request({
    url: '/api/manager/goods/' + ids,
      method: 'delete'
  })
}

export function listCatAndBrand() {
  return request({
    url: '/api/manager/goods/listCatAndBrand',
    method: 'get'
  })
}

export function getGoodsDetail(id) {
  return request({
    url: '/api/manager/goods/detail',
    method: 'get',
    params: { id }
  })
}

export function getAttributeBaseAll() {
  return request({
    url: '/api/manager/attributeBase/all',
    method: 'get'
  })
}

export function getSpecificationBaseAll() {
  return request({
    url: '/api/manager/specificationBase/all',
    method: 'get'
  })
}

export function initGoodsFromStandardStore() {
  return request({
    url: '/api/manager/goods/initGoodsFromStandardStore',
    method: 'get'
  })
}

export function queryParamsAndAttrByGoodsTypeId(id) {
  return request({
    url: '/api/manager/goods/queryParamsAndAttrByGoodsTypeId?id=' + id,
    method: 'get'
  })
}

export function updateOnSaleStatus(status, id) {
  return request({
    url: '/api/manager/goods/updateOnSaleStatus?id=' + id + '&status=' + status,
    method: 'put'
  })
}

export function updateIsNewStatus(status, id) {
  return request({
    url: '/api/manager/goods/updateIsNewStatus?id=' + id + '&status=' + status,
    method: 'put'
  })
}

export function updateIsHotStatus(status, id) {
  return request({
    url: '/api/manager/goods/updateIsHotStatus?id=' + id + '&status=' + status,
    method: 'put'
  })
}

export function coverFromOut() {
  return request({
    url: '/a/cp/cpCategory/tree',
    method: 'post'
  })
}

export function getByPage(query) {
  if(query){
    query = Vue.prototype.filterObjSpace(query);
  }
  return request({
    url: '/a/cp/cpProducts/getByPage',
    method: 'get',
    params: query
  })
}

export function coverFromOuts(query) {
  return request({
    url: '/api/manager/goods/coverFromOut',
    method: 'get',
    params: query
  })
}

export function handleCategorySpec() {
  return request({
    url: '/api/manager/goods/handleCategorySpec',
    method: 'get'
  })
}

export function downTemplate() {
  return request({
    url: 'api/manager/goods/downTemplate',
    method: 'get',
    responseType: 'blob'
  })
}
