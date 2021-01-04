import request from '@/router/axios'
import Vue from "vue"
import da from "element-ui/src/locale/lang/da";

/**
 * 查询订单中商品明细
 * @param ids
 */
export function selectItemByIds(ids) {
    return request({
        url: '/api/saas/order/selectItemByIds?ids='+ids,
        method: 'get',
    })
}


/**
 * 查询订单中商品明细
 * @param id
 */
export function selectDetail(id) {
    return request({
        url: '/api/saas/oms-enterprise-order/'+id,
        method: 'get',
    })
}


/**
 * 生成EDI订单
 * @param data
 */
export function generateOrderItem(data) {
    return request({
        url: '/api/saas/order/generateOrderItem',
        method: 'post',
        data
    })
}


/**
 * 分页查询EDI订单
 * @param query
 */
export function page(query) {
    if(query){
        query = Vue.prototype.filterObjSpace(query);
    }
    return request({
        url: '/api/saas/oms-enterprise-order/selectPage',
        method: 'get',
        params: query
    })
}
