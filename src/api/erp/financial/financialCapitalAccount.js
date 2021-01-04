import request from '@/router/axios'
import Vue from "vue"
export function page(query) {
    if(query){
        query = Vue.prototype.filterObjSpace(query);
    }
    return request({
        url: '/api/manager/financial-capital-account/page',
        method: 'get',
        params: query
    })
}

export function pageCompanyAccount(query) {
    return request({
        url: '/api/manager/financial-capital-account/pageCompanyAccount',
        method: 'get',
        params: query
    })
}

export function getTakeAccount(query) {
    return request({
        url: '/api/manager/financial-capital-account/getTakeAccount',
        method: 'get',
        params: query
    })
}

export function addObj(obj) {
    return request({
        url: '/api/manager/financial-capital-account',
        method: 'post',
        data: obj
    })
}

export function getObj(id) {
    return request({
        url: '/api/manager/financial-capital-account/' + id,
        method: 'get'
    })
}

export function delObj(id) {
    return request({
        url: '/api/manager/financial-capital-account/' + id,
        method: 'delete'
    })
}

export function putObj(id, obj) {
    return request({
        url: '/api/manager/financial-capital-account/' + id,
        method: 'put',
        data: obj
    })
}

export function updateStatus(id, status) {
    return request({
        url: '/api/manager/financial-capital-account/updateStatus?id=' + id + "&status=" + status,
        method: 'post'
    })
}
export function summary(accountCode) {
    if(accountCode == undefined){
        return request({
            url: `/api/manager/financial-transaction-flow/summary`,
            method: 'get'
        })
    }else{
        return request({
            url: `/api/manager/financial-transaction-flow/summary?accountCode=${accountCode}`,
            method: 'get'
        })
    }

}
export function stockSummary(accountCode) {
    if(accountCode == undefined){
        return request({
            url: `/api/manager/financial-transaction-flow/stockSummary`,
            method: 'get'
        })
    }else{
        return request({
            url: `/api/manager/financial-transaction-flow/stockSummary?accountCode=${accountCode}`,
            method: 'get'
        })
    }

}

