import request from '@/router/axios'
import Vue from "vue"
import da from "element-ui/src/locale/lang/da";

/**
 * 新增商品标签
 * obj 新增商品标签数据
 */
export function addGoodsTag(obj) {
    return request({
        url: 'api/saas/goodsTag',
        method: 'post',
        data:obj
    })
}

/**
 * 修改商品标签
 * @param obj 修改商品标签数据
 */
export function updateGoodsTag(obj) {
    return request({
        url: 'api/saas/goodsTag/changeGoodsTag',
        method: 'put',
        params:obj
    })
}

/**
 * 分页查询标签列表
 * @param query
 */
export function page(query) {
    if(query){
        query = Vue.prototype.filterObjSpace(query);
    }
    return request({
        url: '/api/saas/goodsTag/page',
        method: 'get',
        params: query
    })
}

/**
 * 分页查询标签列表
 * @param query
 */
export function searchPage(query) {
    if(query){
        query = Vue.prototype.filterObjSpace(query);
    }
    return request({
        url: '/api/saas/goodsTag/searchPage',
        method: 'get',
        params: query
    })
}

/**
 * 是否显示此标签
 * @param status 更改后状态
 * @param id id
 */
export function updateStatus(status,id) {
    return request({
        url: '/api/saas/goodsTag/updateStatus?id='+id+'&status='+status,
        method: 'post',
    })
}

/**
 * 移除单个标签
 * @param id 标签id
 */
export function deleteTag(id) {
    return request({
        url: '/api/saas/goodsTag/'+id,
        method: 'delete',
    })
}

/**
 * 获取所有标签
 */
export function getAllTag() {
    return request({
        url: '/api/saas/goodsTag/searchAll',
        method: 'get',
    })
}
