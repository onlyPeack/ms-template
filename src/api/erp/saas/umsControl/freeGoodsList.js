import request from '@/router/axios'
import Vue from "vue"

/**
 *分页获取所有数据
 * @param query
 */
export function page(query) {
    if(query){
        query = Vue.prototype.filterObjSpace(query);
    }
    return request({
        url: '/api/saas/ums-member-giveaway/page',
        method: 'post',
        params: query
    })
}

/**
 * 新建满赠商品
 * @param data 满赠商品信息
 */
export function addFreeGood(data) {
    return request({
        url: '/api/saas/ums-member-giveaway/create',
        method: 'post',
        data: data
    })
}

/**
 * 编辑满赠商品
 * @param data 满赠商品信息
 */
export function updateFreeGood(data) {
    return request({
        url: '/api/saas/ums-member-giveaway/update',
        method: 'post',
        data: data
    })
}

/**
 * 删除满赠商品
 * @param ids 需要删除的满赠商品id数组
 */
export function deleteFreeGood(ids) {
    return request({
        url: '/api/saas/ums-member-giveaway/deleteBatch?ids='+ids,
        method: 'get',
    })
}
