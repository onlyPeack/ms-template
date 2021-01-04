import request from '@/router/axios'
import Vue from "vue"

//批次号展示
export function pageByBatchNo(query) {
    if (query) {
        query = Vue.prototype.filterObjSpace(query);
    }
    return request({
        url: '/api/manager/stock-detail/pageByBatchNo',
        method: 'get',
        params: query
    })
}

//按库存汇总展示
export function pageBySingleProduct(query) {
    if (query) {
        query = Vue.prototype.filterObjSpace(query);
    }
    return request({
        url: '/api/manager/stock-detail/pageBySingleProduct',
        method: 'get',
        params: query
    })
}


//按库存汇总展示
export function queryStockWarning(query) {
    if (query) {
        query = Vue.prototype.filterObjSpace(query);
    }
    return request({
        url: '/api/manager/stock-detail/queryStockWarning',
        method: 'get',
        params: query
    })
}

//共享库存查询
export function getStockSharingDataList(query) {
    if (query) {
        query = Vue.prototype.filterObjSpace(query);
    }
    return request({
        url: '/api/manager/stock-detail/getStockSharingDataList',
        method: 'get',
        params: query
    })
}

//期初库存查询
export function selectBeginningStock(query) {
    if (query) {
        query = Vue.prototype.filterObjSpace(query);
    }
    return request({
        url: '/api/manager/stock-detail/selectBeginningStock',
        method: 'get',
        params: query
    })
}

export function queryStockDetail(query) {
    if (query) {
        query = Vue.prototype.filterObjSpace(query);
    }
    return request({
        url: '/api/manager/stock-detail/queryStockDetail',
        method: 'get',
        params: query
    })
}

export function pageByProduct(query) {
    if (query) {
        query = Vue.prototype.filterObjSpace(query);
    }
    return request({
        url: '/api/manager/stock-detail/pageByProduct',
        method: 'get',
        params: query
    })
}

export function pageByProductPosition(query) {
    if (query) {
        query = Vue.prototype.filterObjSpace(query);
    }
    return request({
        url: '/api/manager/stock-detail/pageByProductPosition',
        method: 'get',
        params: query
    })
}

export function stockSummary(query) {
    if (query) {
        query = Vue.prototype.filterObjSpace(query);
    }
    return request({
        url: '/api/manager/stock-detail/stockSummary',
        method: 'get',
        params: query
    })
}

export function queryStockAndCostPrice() {
    return request({
        url: '/api/manager/home-page-data/queryStockAndCostPrice',
        method: 'get'
    })
}

export function queryStockBrand() {
    return request({
        url: '/api/manager/home-page-data/queryStockBrand',
        method: 'get'
    })
}

export function queryWarehouseRank(dateType) {
    return request({
        url: '/api/manager/home-page-data/queryWarehouseRank?dateType=' + dateType,
        method: 'get'
    })
}

export function querySalerRank(dateType) {
    return request({
        url: '/api/manager/home-page-data/querySalerRank?dateType=' + dateType,
        method: 'get',
    })
}

export function queryCustomerRank(dateType) {
    return request({
        url: '/api/manager/home-page-data/queryCustomerRank?dateType=' + dateType,
        method: 'get',
    })
}

export function querySalesReceivableRank(dateType) {
    return request({
        url: '/api/manager/home-page-data/querySalesReceivableRank?dateType=' + dateType,
        method: 'get',
    })
}

//期初库存录入
export function enteringStock(query) {
    return request({
        url: '/api/manager/stock-detail/enteringStock',
        method: 'post',
        data: query
    })
}

export function stockDetailDelete(id) {
    return request({
        url: `/api/manager/stock-detail/${id}`,
        method: 'delete',
    })
}

export function pageBySkuNoAndWarehouseId(query) {
    return request({
        url: `/api/manager/stock-detail/pageBySkuNoAndWarehouseId`,
        method: 'get',
        params: query
    })
}

//库存修改单选择商品的接口
export function selectStockByWarehouseId(query) {
    if (query) {
        query = Vue.prototype.filterObjSpace(query);
    }
    return request({
        url: '/api/manager/stock-detail/selectStockByWarehouseId',
        method: 'get',
        params: query
    })
}

//商品调拨单选择商品的接口
export function selectByWarehouseIdAndPositionId(query) {
    if (query) {
        query = Vue.prototype.filterObjSpace(query);
    }
    return request({
        url: '/api/manager/stock-detail/pageByWarehouseIdAndPositionId',
        method: 'get',
        params: query
    })
}