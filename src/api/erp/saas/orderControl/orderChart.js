import request from '@/router/axios'
import Vue from "vue"

/**
 *获取图表数据
 */
export function getChartData() {
    return request({
        url: '/api/saas/order-analysis/getLastOrder',
        method: 'post',
    })
}

/**
 *获取首页信息：今日销售额，今日订单数，本月销售额，本月订单数
 */
export function getCardData() {
    return request({
        url: '/api/saas/order-analysis/getHomeContent',
        method: 'post',
    })
}

/**
 *获取首页信息：商品和会员统计
 */
export function getStatistics() {
    return request({
        url: '/api/saas/order-analysis/statistics',
        method: 'get',
    })
}


/**
 *获取首页信息：商品排名
 */
export function getGoodsRank() {
    return request({
        url: '/api/saas/order-analysis/goodsRank',
        method: 'get',
    })
}
