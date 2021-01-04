import request from '@/router/axios'
import Vue from "vue"

/**
 * 初始化分类、品牌、系列
 * @param tenantId 承租人ID
 */
export function init(tenantId) {
    return request({
        url: '/api/saas/category/initialization?tenantId='+tenantId,
        method: 'get',
    })
}


/**
 * 查询是否已经初始化
 */
export function isInit() {
    return request({
        url: '/api/saas/category/isInit',
        method: 'get',
    })
}
