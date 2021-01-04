import request from '@/router/axios'
import Vue from "vue"

/**
 * 获取品牌列表数据
 * @param query
 */
export function page(query) {
    if(query){
        query = Vue.prototype.filterObjSpace(query);
    }
    return request({
        url: '/api/saas/brand/page',
        method: 'get',
        params: query
    })
}

/**
 * 新增品牌
 * @param obj 新增品牌的数据对象
 */
export function addBrand(obj) {
    return request({
        url: '/api/saas/brand',
        method: 'post',
        data:obj
    })
}

/**
 * 更新单个品牌
 * @param query 需要更新的品牌信息数组
 */
export function updateBrand(obj) {
    return request({
        url: 'api/saas/brand/'+obj.id,
        method: 'put',
        data:obj
    })
}

/**
 * 移除多个品牌
 * @param obj 需要删除的品牌id数组
 */
export function deleteMultiBrand(ids) {
    return request({
        url: 'api/saas/brand/deleted?ids='+ids,
        method: 'post',
    })
}
