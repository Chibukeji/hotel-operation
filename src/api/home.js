import request from '@/utils/request'

//获取登录平台
export function getPlatforms(data) {
  return request({
    url: '/main/getPlatforms',
    method: 'get',
    params:data
  })
}
// 操作日志
export function getLogList(data) {
  return request({
    url: '/main/log/list',
    method: 'get',
    params:data
  })
}