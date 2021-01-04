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
        url: '/api/saas/home/advertise/list',
        method: 'get',
        params: query
    })
}

/**
 * 修改广告
 * @param data 修改广告广告内容
 */
export function updateAdvertise(data) {
    return request({
        url: '/api/saas/home/advertise/update/'+data.id,
        method: 'post',
        data: data
    })
}

/**
 * 新建广告
 * @param data 新建广告广告内容
 */
export function createAdvertise(data) {
    return request({
        url: '/api/saas/home/advertise/create',
        method: 'post',
        data: data
    })
}

/**
 * 批量删除广告
 * @param ids
 */
export function deleteAdvertise(ids) {
    return request({
        url: '/api/saas/home/advertise/delete?ids='+ids,
        method: 'post',
    })
}







