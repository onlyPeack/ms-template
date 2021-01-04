import request from '@/router/axios';
import Vue from "vue"
export function page(query) {
    if(query){
        query = Vue.prototype.filterObjSpace(query);
    }
    return request({
        url: '/api/manager/database/selectPage',
        method: 'get',
        params: query
    })
}
export function selectPage(query) {
    if(query){
        query = Vue.prototype.filterObjSpace(query);
    }
    return request({
        url: '/api/manager/data/selectPage',
        method: 'get',
        params: query
    })
}
export function delObj(id) {
    return request({
        url: '/api/admin/user/' + id,
        method: 'delete'
    })
}
export function updateStatus(id,status) {
    return request({
        url: `/api/admin/user/updateStatus?id=${id}&status=${status}`,
        method: 'post',
    })
}
export function backup() {
    return request({
        url: `/api/manager/database/backup`,
        method: 'post',
    })
}
export function queryBackupProgress() {
    return request({
        url: `/api/manager/database/queryBackupProgress`,
        method: 'get',
    })
}