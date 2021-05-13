import request from '@/utils/request'

// 列表
export function getCommissionsLogList(data) {
  return request({
    url: '/main/commissions/list',
    method: 'get',
    params: data
  })
}