import request from '@/router/axios'
import Vue from "vue"

/**
 *从产品库获取产品数据
 * @param query
 */
export function page(query) {
    if(query){
        query = Vue.prototype.filterObjSpace(query);
    }
    return request({
        url: '/api/saas/goods/selectFromOut',
        method: 'get',
        params: query
    })
}

/**
 *从产品库获取产品树
 */
export function getTree(query) {
    return request({
        url: '/api/saas/goods/selectCategoryFromOut',
        method: 'get',
        params: query
    })
}

/**
 *从ERP获取数据
 */
export function selectPageFromErp(query) {
    return request({
        url: '/api/saas/goods/selectPageFromErp',
        method: 'get',
        params: query
    })
}

/**
 *从产品库导入数据2.0
 */
export function coverFromErp(query) {
    return request({
        url: '/api/saas/goods/coverFromErp',
        method: 'get',
        params: query
    })
}
