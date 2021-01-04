import request from '@/router/axios'
import Vue from "vue"

/**
 *分页查询推荐专题
 * @param query 查询条件
 */
export function page(query) {
    if(query){
        query = Vue.prototype.filterObjSpace(query);
    }
    return request({
        url: '/api/saas/goods/pageRecommend',
        method: 'get',
        params: query
    })
}

/**
 * 新增&删除推荐商品
 * @param ids 需要操作的商品id数组
 * @param status 1:新增 0:删除
 */
export function addAndDelGoodsRecommend(ids,status) {
    return request({
        url: '/api/saas/goods/insertRecommend?ids='+ids+'&status='+status,
        method: 'get',
    })
}
