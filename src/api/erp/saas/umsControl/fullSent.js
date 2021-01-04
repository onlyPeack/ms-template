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
        url: '/api/saas/ums-member-activity/page',
        method: 'post',
        params: query
    })
}

/**
 * 新建满送
 * @param data 满送数据
 */
export function createFullSend(data) {
    return request({
        url: '/api/saas/ums-member-activity/create',
        method: 'post',
        data: data
    })
}

/**
 * 获取满送满送详情
 * @param data 满送id
 */
export function fullSendDetail(data) {
    return request({
        url: '/api/saas/ums-member-activity/get',
        method: 'post',
        data:data
    })
}

/**
 * 删除满送
 * @param data 满送id
 */
export function deleteFullSend(data) {
    return request({
        url: '/api/saas/ums-member-activity/deleteBatch?ids='+data.ids+'&type='+data.type,
        method: 'get',
    })
}

/**
 * 修改满送
 * @param data 需要修改的数据
 */
export function updateFullSend(data) {
    return request({
        url: '/api/saas/ums-member-activity/update',
        method: 'post',
        data:data
    })
}

/**
 * 修改满送状态
 * @param data 需要修改的数据
 */
export function changeFullSendStatus(data) {
    return request({
        url: '/api/saas/ums-member-activity/status',
        method: 'get',
        params:data
    })
}
