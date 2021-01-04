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
        url: '/api/saas/cmsStoreyGood/page',
        method: 'get',
        params: query
    })
}

/**
 * 获取商城楼层数据源
 */
export function getTree() {
    return request({
        url: '/api/saas/cmsStoreyTree/tree',
        method: 'get',
    })
}

/**
 * 新建商城楼层分类
 * @param obj
 */
export function createTree(obj) {
    return request({
        url: '/api/saas/cmsStoreyTree',
        method: 'post',
        data:obj
    })
}

/**
 * 更新商品楼层分类
 * @param obj
 */
export function updateTree(obj) {
    return request({
        url: '/api/saas/cmsStoreyTree/'+obj.id,
        method: 'put',
        data:obj
    })
}

/**
 * 新建商城商品楼层商品
 * @param obj 新增商品商品内容
 */
export function createStoreGoods(obj) {
    return request({
        url: '/api/saas/cmsStoreyGood/insertBatch',
        method: 'post',
        data:obj
    })
}

/**
 *移除单个商城商品楼层中商品
 * @param id 商品id
 */
export function deleteStoreGood(id) {
    return request({
        url: '/api/saas/cmsStoreyGood/'+id,
        method: 'delete',
    })
}

/**
 *移除单个商城商品楼层
 * @param id 楼层id
 */
export function deleteStoreGoodTree(id) {
    return request({
        url: '/api/saas/cmsStoreyTree/'+id,
        method: 'delete',
    })
}









