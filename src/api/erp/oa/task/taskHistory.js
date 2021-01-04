import request from '@/router/axios'
import Vue from "vue"
export function getTaskHistoryList(billNo, processId) {
  return request({
    url: '/api/oa/taskHistory/getTaskHistoryList?processId=' + processId + '&billNo=' + billNo,
    method: 'get'
  })
}

export function getTaskHistoryPage(query) {
  if(query){
    query = Vue.prototype.filterObjSpace(query);
  }
  return request({
    url: '/api/oa/taskHistory/getTaskHistoryPage',
    method: 'get',
    params: query
  })
}
