import request from '@/router/axios'
import Vue from "vue"

export function businessCreate(obj) {
    return request({
        url: 'api/manager/general-configuration/businessCreate',
        method: 'post',
        data: obj
    })
}

export function financialCreate(obj) {
    return request({
        url: '/api/manager/general-configuration/financialCreate',
        method: 'post',
        data: obj
    })
}
export function stockCreate(obj) {
    return request({
        url: '/api/manager/general-configuration/stockCreate',
        method: 'post',
        data: obj
    })
}


export function businessList() {
    return request({
        url: 'api/manager/general-configuration/businessList',
        method: 'get'
    })
}

export function financialList() {
    return request({
        url: '/api/manager/general-configuration/financialList',
        method: 'get'
    })
}

export function stockList() {
    return request({
        url: '/api/manager/general-configuration/stockList',
        method: 'get'
    })
}

export function getStockOutConfig() {
    return request({
        url: 'api/manager/general-configuration/getStockOutConfig',
        method: 'get'
    })
}

export function parameterCreate(obj) {
    return request({
        url: 'api/manager/general-configuration/parameterCreate',
        method: 'post',
        data: obj
    })
}
export function pageAll() {
    return request({
        url: '/api/manager/logistics/pageAll',
        method: 'get'
    })
}
export function getUseStockQty(warehouseId,skuNo) {
    return request({
        url: `/api/manager/sales-order/getUseStockQty?warehouseId=${warehouseId}&skuNo=${skuNo}`,
        method: 'get'
    })
}
export function parameterList() {
    return request({
        url: 'api/manager/general-configuration/parameterList',
        method: 'get'
    })
}
export function messageSetting(obj) {
    return request({
        url: '/api/manager/messageSetting/create',
        method: 'post',
        data: obj
    })
}
export function messageSettingList() {
    return request({
        url: '/api/manager/messageSetting/list',
        method: 'get',
    })
}
export function selectExpressByWarehouseId(warehouseId) {
    return request({
        url: '/api/manager/sales-stock-out/selectExpressByWarehouseId?warehouseId='+warehouseId,
        method: 'get'
    })
}