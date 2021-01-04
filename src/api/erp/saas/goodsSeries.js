import request from '@/router/axios'
import Vue from "vue"
import da from "element-ui/src/locale/lang/da";
export function page(query) {
    if(query){
        query = Vue.prototype.filterObjSpace(query);
    }
    return request({
        url: '/api/saas/series/page',
        method: 'get',
        params: query
    })
}
/**
 * 添加商品系列
 * @param id
 */
export function addSeries(obj) {
    return request({
        // url: '/api/saas/series?seriesId='+obj.seriesId+'&brandId='+obj.brandId+'&name='+obj.name,
        url: '/api/saas/series',
        method: 'post',
        data:obj
    })
}

/**
 * 移除多个商品系列
 * @param obj 需要删除的商品系列id数组
 */
export function deleteMultiSeries(ids) {
    return request({
        url: 'api/saas/series/deleted?ids='+ids,
        method: 'delete',
    })
}

/**
 * 更新单个商品系列
 * @param query 需要更新的商品系列信息数组
 */
export function updateSeries(obj) {
    return request({
        url: 'api/saas/series/'+obj.id,
        method: 'put',
        data:obj
    })
}

/**
 * 更新规格参数
 * @param obj 规格参数数据集合
 */
export function updateSpecification(obj) {
    return request({
        url: 'api/saas/t-series-specifications/createOrUp',
        method: 'post',
        data:obj
    })
}

/**
 * 获取所有商品系列
 */
export function getAllSeries() {
    return request({
        url: 'api/saas/series/pageAll',
        method: 'get',
    })
}

