import request from '@/router/axios'
import Vue from "vue"

export function addObj(data) {
    return request({
        url: '/api/cms/cms-column',
        method: 'post',
        data
    })
}

/**
 * 关联模板
 * @param data
 */
export function insertBatch(data) {
    return request({
        url: '/api/cms/cms-column-model-relationship/insertBatch',
        method: 'post',
        data
    })
}

/**
 * 模板排序
 * @param data
 */
export function replaceInsertBatch(data) {
    return request({
        url: '/api/cms/cms-column-model-relationship/replaceInsertBatch',
        method: 'post',
        data
    })
}

/**
 * 关联单个模板
 * @param data
 */
export function insertOnce(data) {
    return request({
        url: '/api/cms/cms-column-model-relationship/insert',
        method: 'post',
        data
    })
}

/**
 * 关联详情页
 * @param data
 */
export function bindDetail(data) {
    return request({
        url: '/api/cms/cms-column-model-relationship/bindDetail',
        method: 'post',
        data
    })
}

/**
 * 更新样式
 * @param data
 */
export function updStyle(data) {
    return request({
        url: '/api/cms/cms-column-model-relationship/'+data.id,
        method: 'put',
        data
    })
}

export function delObj(id) {
    return request({
        url: '/api/cms/cms-column/'+id,
        method: 'delete',
    })
}

export function getObj(id) {
    return request({
        url: '/api/cms/cms-column/'+id,
        method: 'get',
    })
}

export function selectBatch(params) {
    return request({
        url: '/api/cms/cms-column-model-relationship/list',
        method: 'get',
        params
    })
}


export function listForWeb(params) {
    return request({
        url: '/api/cms/cms-column-model-relationship/listForWeb',
        method: 'get',
        params
    })
}




export function deleteBatch(id) {
    return request({
        url: '/api/cms/cms-column-model-relationship/'+id,
        method: 'delete',
    })
}

export function putObj(data) {
    return request({
        url: '/api/cms/cms-column/'+data.id,
        method: 'put',
        data
    })
}

export function page(query) {
    if(query){
        query = Vue.prototype.filterObjSpace(query);
    }
    return request({
        url: '/api/cms/cms-column/page',
        method: 'get',
        params: query
    })
}

export function webTree(query) {
    if(query){
        query = Vue.prototype.filterObjSpace(query);
    }
    return request({
        url: '/api/cms/cms-column/listForWeb',
        method: 'get',
        params: query
    })
}

