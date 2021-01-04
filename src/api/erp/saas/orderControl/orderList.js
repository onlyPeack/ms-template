import request from '@/router/axios'
import Vue from "vue"

/**
 *分页查询订单单据
 * @param query 查询条件
 */
export function selectPageByItem(query) {
    if(query){
        query = Vue.prototype.filterObjSpace(query);
    }
    return request({
        url: '/api/saas/oms-order-sub/selectPageByItem',
        method: 'get',
        params: query
    })
}

/**
 *分页查询子订单
 * @param query 查询条件
 */
export function selectPage(query) {
    if(query){
        query = Vue.prototype.filterObjSpace(query);
    }
    return request({
        url: '/api/saas/order/selectPage',
        method: 'get',
        params: query
    })
}

/**
 * 更改商家备注
 * @param obj id和备注 id为主订单id
 */
export function updateOrderNote(obj) {
    return request({
        url: '/api/saas/order/updateNote',
        method: 'post',
        data: obj
    })
}

/**
 *关闭订单
 * @param obj id为主订单id
 */
export function closeOrder(obj) {
    return request({
        url: '/api/saas/order/cancelOrder',
        method: 'get',
        params: obj
    })
}

/**
 * 删除订单
 * @param obj id为主订单id
 */
export function deleteOrder(obj) {
    return request({
        url: '/api/saas/order/delete',
        method: 'post',
        data: obj
    })
}

/**
 * 获取子订单详情
 * @param id 订单id
 */
export function orderDetail(id) {
    return request({
        url: '/api/saas/oms-order-sub/'+id,
        method: 'get',
    })
}

/**
 * 获取主订单详情
 * @param id 订单id
 */
export function orderMainDetail(id) {
    return request({
        url: '/api/saas/order/select?id='+id,
        method: 'get',
    })
}



/**
 * 获取物流方式
 * @param query 查询条件
 */
export function getLogistics(query) {
    return request({
        url: '/api/saas/logistics/page',
        method: 'get',
        params:query
    })
}

/**
 * 立即审核
 * @param id
 */
export function reviewOrder(id) {
    return request({
        url: '/api/saas/order/reviewOrder?orderId='+id,
        method: 'get',
    })
}

/**
 * 发货
 * @param data
 */
export function doDeliver(data) {
    return request({
        url: '/api/saas/oms-order-sub/doDeliver',
        method: 'post',
        data:data
    })
}


/**
 * 查看快递信息
 * @param params
 */
export function searchLogistics(params) {
    return request({
        url: '/api/saas/order/searchLogistics',
        method: 'get',
        params
    })
}


