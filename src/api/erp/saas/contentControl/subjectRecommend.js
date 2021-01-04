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
        url: '/api/saas/cmsSubject/page',
        method: 'get',
        params: query
    })
}

/**
 * 新增专题推荐
 * @param query
 */
export function addSubjectRecommend(query) {
    return request({
        url: '/api/saas/cmsSubject',
        method: 'post',
        data: query
    })
}

/**
 * 编辑专题推荐
 * @param query
 */
export function updateSubjectRecommend(obj) {
    return request({
        url: '/api/saas/cmsSubject/'+obj.id,
        method: 'put',
        data: obj
    })
}

/**
 *批量删除专题推荐
 * @param ids
 */
export function deleteSubjectRecommend(ids) {
    return request({
        url: '/api/saas/cmsSubject/deleteBatch/'+ids,
        method: 'get',
    })
}


