import request from '@/router/axios'
import Vue from "vue"

/**
 *分页查询精选好货
 * @param query 查询条件
 */
export function page(query) {
    if(query){
        query = Vue.prototype.filterObjSpace(query);
    }
    return request({
        url: '/api/saas/cms-featured-goods/page',
        method: 'get',
        params: query
    })
}


/**
 *新增精选好货
 * @param data 新增参数
 */
export function createPerfectGoods(data) {
    return request({
        url: '/api/saas/cms-featured-goods/create',
        method: 'post',
        data: data
    })
}

/**
 * 编辑精选好货
 * @param obj 编辑参数
 */
export function updatePerfectGoods(obj) {
    return request({
        url: '/api/saas/cms-featured-goods/'+obj.id,
        method: 'put',
        data: obj
    })
}


/**
 *批量删除精选好货
 * @param ids
 */
export function deletePerfectGoods(ids) {
    return request({
        url: '/api/saas/cms-featured-goods/deleteBatch/'+ids,
        method: 'get',
    })
}
