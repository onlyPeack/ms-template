import request from '@/router/axios'
import Vue from "vue"

export function list(query) {
    if(query){
        query = Vue.prototype.filterObjSpace(query);
    }
    return request({
        url: '/api/manager/project-manage/list',
        method: 'get',
        params: query
    })
}

export function selectPage(query) {
    if(query){
        query = Vue.prototype.filterObjSpace(query);
    }
    return request({
        url: '/api/manager/project-contract/selectPage',
        method: 'get',
        params: query
    })
}
export function contractList(query) {
    if(query){
        query = Vue.prototype.filterObjSpace(query);
    }
    return request({
        url: '/api/manager/project-contract/list',
        method: 'get',
        params: query
    })
}

export function findStaff(query) {
    if(query){
        query = Vue.prototype.filterObjSpace(query);
    }
    return request({
        url: '/api/manager/project-staff-group/findStaff',
        method: 'get',
        params: query
    })
}
export function batchDelBill(ids) {
    return request({
        url: '/api/manager/project-staffs/delete?ids=' + ids,
        method: 'delete'
    })
}
export function auditList(query) {
    if(query){
        query = Vue.prototype.filterObjSpace(query);
    }
    return request({
        url: '/api/manager/project-audit/list',
        method: 'get',
        params: query
    })
}
export function auditUpdate(id,status,note) {
    return request({
        url: '/api/manager/project-audit/audit?id='+ id +'&status=' + status + '&text='+ note,
        method: 'post',
    })
}
export function auditSelect(id) {
    return request({
        url: '/api/manager/project-audit/select/'+ id,
        method: 'get',
    })
}

export function contractPrint(id) {
    return request({
        url: '/api/manager/project-contract/print/'+ id,
        method: 'get',
    })
}

export function statusSelect(id) {
    return request({
        url: '/api/manager/project-start-status/select?id='+ id,
        method: 'get',
    })
}
export function alterSelect(id) {
    return request({
        url: '/api/manager/project-manage-alter/selectBill?id='+ id,
        method: 'get',
    })
}
export function paySelect(id) {
    return request({
        url: '/api/manager/project-pay/select/'+ id,
        method: 'get',
    })
}
export function lists(query) {
    if(query){
        query = Vue.prototype.filterObjSpace(query);
    }
    return request({
        url: '/api/manager/project-staffs/list',
        method: 'get',
        params: query
    })
}
export function sumPay(id) {
    return request({
        url: '/api/manager/project-pay/sumPay?id='+id,
        method: 'get',
    })
}

export function projectEarly() {
    return request({
        url: '/api/manager/project-manage/projectEarly',
        method: 'get',
    })
}


export function listbBdget(query) {
    if(query){
        query = Vue.prototype.filterObjSpace(query);
    }
    return request({
        url: '/api/manager/project-budget/list',
        method: 'get',
        params: query
    })
}

export function batchBudget(ids) {
    return request({
        url: '/api/manager/project-budget/delete?ids=' + ids,
        method: 'delete'
    })
}

export function listData(query) {
    if(query){
        query = Vue.prototype.filterObjSpace(query);
    }
    return request({
        url: '/api/manager/project-data/list',
        method: 'get',
        params: query
    })
}

export function batchData(ids) {
    return request({
        url: '/api/manager/project-data/delete?ids=' + ids,
        method: 'delete'
    })
}

export function addBill(obj) {
    return request({
        url: '/api/manager/project-contract/addBill',
        method: 'post',
        data: obj
    })
}
export function getBill(id) {
    return request({
        url: '/api/manager/project-contract/getBill?id=' + id,
        method: 'get'
    })
}

export function addBudget(obj) {
    return request({
        url: '/api/manager/project-budget/add',
        method: 'post',
        data: obj
    })
}

export function addData(obj) {
    return request({
        url: '/api/manager/project-data/add',
        method: 'post',
        data: obj
    })
}

export function payList(query) {
    if(query) {
        query = Vue.prototype.filterObjSpace(query);
    }
    return request({
        url: '/api/manager/project-pay/list',
        method: 'get',
        params: query
    })
}

export function alterList(query) {
    if(query) {
        query = Vue.prototype.filterObjSpace(query);
    }
    return request({
        url: '/api/manager/project-manage-alter/list',
        method: 'get',
        params: query
    })
}
export function stakeList(query) {
    if(query){
        query = Vue.prototype.filterObjSpace(query);
    }
    return request({
        url: '/api/manager/project-stake-order/list',
        method: 'get',
        params: query
    })
}
export function stakeSelect(id) {
    return request({
        url: '/api/manager/project-stake-order/select/' + id,
        method: 'get',
    })
}

export function projectSelect(id) {
    return request({
        url: '/api/manager/project-manage/groupProject/' + id,
        method: 'get',
    })
}
export function select(id) {
    return request({
        url: '/api/manager/project-manage/select/' + id,
        method: 'get',
    })
}
export function putStake(obj) {
    return request({
        url: '/api/manager/project-stake-order/update',
        method: 'post',
        data: obj
    })
}
export function putBudget(obj) {
    return request({
        url: '/api/manager/project-budget/update',
        method: 'post',
        data: obj
    })
}
export function putData(obj) {
    return request({
        url: '/api/manager/project-data/update',
        method: 'post',
        data: obj
    })
}
export function updateStatus(status,id,name,flag) {
    return request({
        url: '/api/manager/project-start-status/add',
        method: 'post',
        data: {
            type:status,
            projectBillId:id,
            projectName: name,
            flag:flag!=undefined?flag:0
        }
    })
}
export function findGroup(id) {
    return request({
        url: '/api/manager/project-staff-group/findGroup/' + id,
        method: 'get',
    })
}

export function getDefault(type) {
    return request({
        url: '/api/manager/contract-template/getDefault?type=' + type,
        method: 'get',
    })
}

export function pageAll(query) {
    return request({
        url: '/api/manager/project-type/pageAll',
        method: 'get',
    })
}

export function addObj(obj) {
    return request({
        url: '/api/manager/project-manage/add',
        method: 'post',
        data: obj
    })
}
export function addAlter(obj) {
    return request({
        url: '/api/manager/project-manage-alter/add',
        method: 'post',
        data: obj
    })
}
export function addSpeed(obj) {
    return request({
        url: '/api/manager/project-speed/add',
        method: 'post',
        data: obj
    })
}
export function addPay(obj) {
    return request({
        url: '/api/manager/project-pay/add',
        method: 'post',
        data: obj
    })
}
export function groupPay(id) {
    return request({
        url: '/api/manager/project-pay/groupPay?id='+id,
        method: 'get',
    })
}
export function addGroup(obj) {
    return request({
        url: '/api/manager/project-staff-group/add',
        method: 'post',
        data: obj
    })
}
export function addStaffs(obj) {
    return request({
        url: '/api/manager/project-staffs/add ',
        method: 'post',
        data: obj
    })
}
export function addStake(obj) {
    return request({
        url: '/api/manager/project-stake-order/add',
        method: 'post',
        data: obj
    })
}
export function batchDelStake(ids) {
    return request({
        url: '/api/manager/project-stake-order/delete?ids=' + ids,
        method: 'delete'
    })
}

export function batchDelGroup(ids) {
    return request({
        url: '/api/manager/project-staff-group/delete/' + ids,
        method: 'delete'
    })
}

export function groupByType() {
    return request({
        url: '/api/manager/project-manage/groupByType',
        method: 'get',
    })
}

export function groupByStatus() {
    return request({
        url: '/api/manager/project-manage/groupByStatus',
        method: 'get',
    })
}
