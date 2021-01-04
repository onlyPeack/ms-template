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
        url: '/api/saas/cms-announcement/page',
        method: 'get',
        params: query
    })
}

/**
 * 新建公告
 * @param data
 */
export function create(data) {
    return request({
        url: '/api/saas/cms-announcement/create',
        method: 'post',
        data
    })
}

/**
 * 编辑公告
 * @param data
 */
export function update(data) {
    return request({
        url: '/api/saas/cms-announcement/'+data.id,
        method: 'put',
        data
    })
}

/**
 * 批量删除
 * @param ids 需要删除的id
 */
export function deleteBatch(ids) {
    return request({
        url: '/api/saas/cms-announcement/deleteBatch/'+ids,
        method: 'get',
    })
}
