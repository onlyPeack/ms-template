import request from '@/router/axios'
import Vue from "vue"
export function page(id) {
  return request({
    url: '/api/manager/series/selectByBrandId/' + id,
    method: 'get',
  })
}
