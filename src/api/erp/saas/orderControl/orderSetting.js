import request from '@/router/axios'
import Vue from "vue"

/**
 *查询订单设置
 */
export function selectOrderSetting() {
    return request({
        url: '/api/saas/oms-order-setting/1',
        method: 'get',
    })
}

/**
 *更新订单设置
 */
export function updateOrderSetting(data) {
    return request({
        url: '/api/saas/oms-order-setting/update',
        method: 'post',
        data
    })
}
