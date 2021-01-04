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
        url: '/api/saas/goods/page',
        method: 'get',
        params: query
    })
}

/**
 * 新增单个商品
 * @param obj 需要创建的商品信息
 */
export function addGoods(obj) {
    return request({
        url: '/api/saas/goods/addGoods',
        method: 'post',
        data: obj
    })
}

/**
 * 获取计量单位
 */
export function findMeasureUnit() {
    return request({
        url: '/api/saas/goodMeasureUnit/list',
        method: 'get',
    })
}

/**
 *移除多个商品
 * @param ids 需要移除的商品id集合
 */
export function deleteGoods(ids) {
    return request({
        url: '/api/saas/goods/deleteBatch/'+ids,
        method: 'get',
    })
}

/**
 * 更改单个商品上下架状态
 * @param data 商品信息
 */
export function goodsPutaway(data) {
    return request({
        url: '/api/saas/goods/updateOnSaleStatus?id='+data.id+'&status='+data.status,
        method: 'get',
    })
}

/**
 * 更新单个商品
 * @param data
 */
export function updateGoods(data) {
    return request({
        url: '/api/saas/goods/updateGoods',
        method: 'post',
        data:data
    })
}

/**
 * 贴标签
 * @param data
 */
export function updateGoodsTag(data) {
    return request({
        url: '/api/saas/goods/updateGoodsTag',
        method: 'get',
        params:data
    })
}

/**
 *获取商品详情
 * @param id
 */
export function goodsDetail(id) {
    return request({
        url: '/api/saas/goods/detail?id='+id,
        method: 'get',
    })
}


/**
 * 从产品库导入数据
 * @param params
 */
export function coverFromOut(params) {
    return request({
        url: '/api/saas/goods/coverFromOut',
        method: 'get',
        params
    })
}

/**
 * 从产品库批量导入数据
 */
export function synStock() {
    return request({
        url: '/api/saas/goods/synStockFromOut',
        method: 'get',
    })
}

/**
 * 云同步
 */
export function syncErpStock() {
    return request({
        url: '/api/saas/goods/syncErpStock',
        method: 'get',
    })
}

/**
 * 是否启用ERP
 */
export function enableErp() {
    return request({
        url: 'api/saas/ums-tenant-enable/enableErp',
        method: 'get',
    })
}

/**
 * 批量设置折扣
 */
export function setRetailDiscountBatch(params) {
    return request({
        url: 'api/saas/goods/setRetailDiscountBatch',
        method: 'get',
        params
    })
}
