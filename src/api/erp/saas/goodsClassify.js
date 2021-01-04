import request from '@/router/axios'
import Vue from "vue"

/**
 * 商品分类左侧数据数数据请求
 */
export function listCatAndBrand() {
    return request({
        url: '/api/saas/goods/listCatAndBrand',
        method: 'get'
    })
}

/**
 * 新增商品类目
 */
export function addCategory(obj) {
    return request({
        url: 'api/saas/category',
        method: 'post',
        data:obj
    })
}
/**
 * 根据条件获取所有类目
 */
export function getCategory(query) {
    return request({
        url: 'api/saas/category/page',
        method: 'get',
        params:query
    })
}


/**
 * 根据条件获取所有类目
 */
export function treePage(params) {
    return request({
        url: 'api/saas/category/treePage',
        method: 'get',
        params
    })
}

/**
 * 获取规格参数
 */
export function getSpecifications(id) {
    return request({
        url: 'api/saas/category/getSpecifications?id='+id,
        method: 'get',
    })
}



/**
 * 更新商品类目显示状态
 * @param status 更改后状态
 * @param id 类目id
 */
export function updateShowStatus(status,id) {
    return request({
        url: 'api/saas/category/updateShowStatus?id=' + id + '&status=' + status,
        method: 'put',
    })
}

/**
 * 移除单个商品类目
 * @param id 类目id
 */
export function deleteCategory(id) {
    return request({
        url: 'api/saas/category/'+id,
        method: 'delete',
    })
}

/**
 * 移除多个商品类目
 * @param obj 需要删除的类目id数组
 */
export function deleteMultiCategory(ids) {
    return request({
        url: 'api/saas/category/deleted?ids='+ids,
        method: 'post',
    })
}

/**
 * 更新单个商品类目
 * @param query 需要更新的商品类目信息数组
 */
export function updateCategory(obj) {
    return request({
        url: 'api/saas/category/'+obj.id,
        method: 'put',
        data:obj
    })
}

