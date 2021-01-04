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
        url: '/api/saas/ums-member-help-setting/page',
        method: 'post',
        data: query
    })
}

/**
 * 新增栏目
 * @param data
 */
export function addColumn(data) {
    return request({
        url: '/api/saas/ums-member-help-setting/create',
        method: 'post',
        data
    })
}

/**
 * 获取所有父栏目
 */
export function getPidColumn() {
    return request({
        url: '/api/saas/ums-member-help-setting/list',
        method: 'get',
    })
}

/**
 * 删除栏目
 * @param ids 需要删除打栏目id数组
 */
export function delColumn(ids) {
    return request({
        url: '/api/saas/ums-member-help-setting/deleteBatch?ids='+ids,
        method: 'get',
    })
}

/**
 * 修改栏目
 * @param data
 */
export function updateColumn(data) {
    return request({
        url: '/api/saas/ums-member-help-setting/update',
        method: 'post',
        data
    })
}

/**
 * 修改栏目启用状态
 * @param id
 * @param status 状态
 */
export function updateColumnStatus(id,status) {
    return request({
        url: '/api/saas/ums-member-help-setting/updateStatus?id='+id+'&status='+status,
        method: 'get',
    })
}
