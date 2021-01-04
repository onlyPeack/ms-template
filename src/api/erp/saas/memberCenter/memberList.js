import request from '@/router/axios'
import Vue from "vue"

/**
 *分页获取会员数据
 * @param query 查询条件
 */
export function page(query) {
    if(query){
        query = Vue.prototype.filterObjSpace(query);
    }
    return request({
        url: '/api/saas/sso/page',
        method: 'get',
        params: query
    })
}

/**
 * 更新会员信息
 * @param id 会员id
 * @param data 需要更改的数据集合
 */
export function updateMember(id,data) {
    return request({
        url: '/api/saas/sso/update/'+id,
        method: 'post',
        data: data
    })
}

/**
 * 重置密码
 * @param id 会员id
 */
export function resetPassword(id) {
    return request({
        url: '/api/saas/sso/resetPwd',
        method: 'post',
        data: id
    })
}

/**
 * 会员充值
 * @param params
 */
export function recharge(params) {
    return request({
        url: '/api/saas/memberBalance/recharge',
        method: 'get',
        params
    })
}

/**
 * 获取会员信息
 * @param ids
 */
export function getMember(ids) {
    return request({
        url: '/api/saas/sso/selectIds/'+ids,
        method: 'post',
    })
}
