import request from '@/router/axios';
import Vue from "vue"

export function addObj(obj) {
  return request({
    url: '/api/admin/groupOffice/saveRe',
    method: 'post',
    data: obj
  })
}


export function getByGroupId(id) {
  return request({
    url: '/api/admin/groupOffice/getByGroupId?groupId=' + id,
    method: 'get'
  })
}

