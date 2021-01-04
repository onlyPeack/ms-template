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
        url: '/api/saas/hot-tags/page',
        method: 'get',
        params: query
    })
}

/**
 *新建热门搜索
 * @param data
 */
export function addObj(data) {
    return request({
        url: '/api/saas/hot-tags',
        method: 'post',
        data
    })
}

/**
 *编辑热门搜索
 * @param data
 */
export function putObj(data) {
    return request({
        url: '/api/saas/hot-tags/changeHotTag',
        method: 'post',
        data
    })
}

/**
 *删除热门搜索
 * @param id
 */
export function delObj(id) {
    return request({
        url: '/api/saas/hot-tags/'+id,
        method: 'delete',
    })
}


