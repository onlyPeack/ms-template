import request from '@/router/axios'

export function getOrderSetting(id) {
  return request({
    url: '/api/mall/oms-order-setting/' + id,
    method: 'get'
  })
}

export function updateOrderSetting(obj) {
  return request({
    url: '/api/mall/oms-order-setting/update',
    method: 'post',
    data: obj
  })
}
