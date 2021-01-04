import request from '@/router/axios'
import Vue from "vue"

/**
 *分页查询短信记录
 * @param query 查询条件
 */
export function page(query) {
    if(query){
        query = Vue.prototype.filterObjSpace(query);
    }
    return request({
        url: '/api/saas/sms/tableRecord/list',
        method: 'get',
        params: query
    })
}

/**
 *删除短信
 * @param data 需要删除的短信id数组
 */
export function deleteNote(data) {
    return request({
        url: '/api/saas/sms/tableRecord/delete',
        method: 'post',
        params: data
    })
}
