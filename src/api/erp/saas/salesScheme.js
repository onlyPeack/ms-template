import request from '@/router/axios'
import Vue from "vue"
import da from "element-ui/src/locale/lang/da";

/**
 * 新增价格方案
 *
 */
export function addObj(data) {
    return request({
        url: 'api/saas/sales-pricing-scheme',
        method: 'post',
        data
    })
}

/**
 * 新增价格方案
 *
 */
export function updObj(data) {
    return request({
        url: 'api/saas/sales-pricing-scheme/update',
        method: 'post',
        data
    })
}

/**
 * 删除价格方案
 *
 */
export function delObj(id) {
    return request({
        url: 'api/saas/sales-pricing-scheme/'+id,
        method: 'delete',
    })
}

/**
 * 分页查询价格方案列表
 * @param query
 */
export function page(query) {
    if(query){
        query = Vue.prototype.filterObjSpace(query);
    }
    return request({
        url: '/api/saas/sales-pricing-scheme/page',
        method: 'get',
        params: query
    })
}
