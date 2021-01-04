import request from '@/router/axios'
import Vue from "vue"

/**
 *分页查询推荐品牌
 * @param query 查询条件
 */
export function page(query) {
    if(query){
        query = Vue.prototype.filterObjSpace(query);
    }
    return request({
        url: '/api/saas/home/brand/list',
        method: 'get',
        params: query
    })
}

/**
 * 更新推荐品牌排序
 * @param query 更新参数
 */
export function updateSort(query) {
    return request({
        url: '/api/saas/home/brand/update/sort/'+query.id,
        method: 'post',
        params: query
    })
}

/**
 * 编辑推荐品牌
 * @param query
 */
export function updateBrandRecommend(query) {
    return request({
        url: '/api/saas/home/brand/update/',
        method: 'post',
        data: query
    })
}

/**
 * 批量删除推荐品牌
 * @param ids 需要删除的推荐品牌id集合
 */
export function deleteBrandRecommend(ids) {
    return request({
        url: '/api/saas/home/brand/delete?ids='+ids,
        method: 'post',
    })
}

/**
 * 新建推荐品牌
 * @param data
 */
export function createBrandRecommend(data) {
    return request({
        url: '/api/saas/home/brand/create',
        method: 'post',
        data:data
    })
}

/**
 * 批量修改推荐品牌推荐状态
 * @param data 需要修改的推荐品牌信息
 */
export function changeBrandRecommendStatus(data) {
    return request({
        url: '/api/saas/home/brand/update/recommendStatus',
        method: 'post',
        data:data
    })
}
