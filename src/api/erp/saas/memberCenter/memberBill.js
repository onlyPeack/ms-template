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
        url: '/api/saas/memberBalanceRecord/pageAll',
        method: 'get',
        params: query
    })
}
