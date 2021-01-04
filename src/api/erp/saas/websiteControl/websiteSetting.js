import request from '@/router/axios'
import Vue from "vue"

/**
 *查询网站设置
 */
export function selectWebsiteSetting() {
    return request({
        url: '/api/saas/web-setting/get',
        method: 'get',
    })
}

/**
 *更新网站设置
 */
export function updateWebsiteSetting(data) {
    return request({
        url: '/api/saas/web-setting/update',
        method: 'post',
        data
    })
}

/**
 *更新运费设置
 */
export function updateTransportManager(data) {
    return request({
        url: '/api/saas/ums-transport-manager/save',
        method: 'post',
        data
    })
}

/**
 *查询运费设置
 */
export function selectTransportManager() {
    return request({
        url: '/api/saas/ums-transport-manager/get',
        method: 'get',
    })
}

/**
 *查询短信设置
 */
export function selectNoteSetting() {
    return request({
        url: '/api/saas/sms-enable-setting',
        method: 'get',
    })
}

/**
 *开启ERP
 */
export function createOrUpdateEnable(data) {
    return request({
        url: '/api/saas/ums-tenant-enable/createOrUpdateEnable',
        method: 'post',
        data
    })
}

/**
 *更新短信设置
 */
export function updateNoteSetting(data) {
    return request({
        url: '/api/saas/sms-enable-setting',
        method: 'post',
        data
    })
}

/**
 *分页获取短信模板
 * @param query
 */
export function selectTemplate(query) {
    if(query){
        query = Vue.prototype.filterObjSpace(query);
    }
    return request({
        url: '/api/saas/sms-template-setting/selectTemplate',
        method: 'get',
        params: query
    })
}

/**
 *创建短信设置
 * @param data
 */
export function createTemplate(data) {
    return request({
        url: '/api/saas/sms-template-setting/create',
        method: 'post',
        data
    })
}

/**
 *更改短信设置
 * @param data
 */
export function updateTemplate(data) {
    return request({
        url: '/api/saas/sms-template-setting/update',
        method: 'post',
        data
    })
}

/**
 *删除短信设置
 * @param id
 */
export function deleteTemplate(id) {
    return request({
        url: '/api/saas/sms-template-setting/delete?ids='+id,
        method: 'post',
    })
}

/**
 *分页查询短信设置
 * @param query
 */
export function selectNoteSettingPage(query) {
    if(query){
        query = Vue.prototype.filterObjSpace(query);
    }
    return request({
        url: '/api/saas/sms-template-setting/page',
        method: 'get',
        params: query
    })
}
