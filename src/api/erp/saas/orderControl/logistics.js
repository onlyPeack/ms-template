import request from '@/router/axios'
import Vue from "vue"
import da from "element-ui/src/locale/lang/da";

/**
 * 分页查询物流快递
 * @param query
 */
export function page(query) {
    if(query){
        query = Vue.prototype.filterObjSpace(query);
    }
    return request({
        url: '/api/saas/cmsLogistics/page',
        method: 'get',
        params: query
    })
}

/**
 * 更新物流快递
 * @param data 需要更新的信息
 */
export function updateLogistics(data) {
    return request({
        url: '/api/saas/cmsLogistics/'+data.id,
        method: 'put',
        data: data
    })
}

/**
 * 新建物流快递
 * @param data 需要新建的物流快递信息
 */
export function createLogistics(data) {
    return request({
        url: '/api/saas/cmsLogistics/create',
        method: 'post',
        data: data
    })
}

/**
 * 批量删除物流快递
 * @param ids 物流快递id数组
 */
export function deleteLogistics(ids) {
    return request({
        url: '/api/saas/cmsLogistics/deleteBatch/'+ids,
        method: 'get',
    })
}

/**
 * 获取全部物流快递
 */
export function allLogistics() {
    return request({
        url: '/api/saas/cmsLogistics/list',
        method: 'get',
    })
}
