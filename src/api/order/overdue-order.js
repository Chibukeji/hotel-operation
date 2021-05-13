import request from '@/utils/request'

// 列表
export function getOverdueOrderList(data) {
  return request({
    url: '/main/divtime_expire/list',
    method: 'get',
    params: data
  })
}
//详情
export function getOverdueOrderDetailList(data) {
  return request({
    url: '/main/divtime_expire/detail',
    method: 'get',
    params: data
  })
}