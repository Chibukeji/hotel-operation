import request from '@/utils/request'

// 列表
export function getServiceList(data) {
  return request({
    url: '/main/service/list',
    method: 'get',
    params: data
  })
}
// 添加
export function getServiceAdd(data) {
  return request({
    url: '/main/service/add',
    method: 'post',
    data
  })
}
// 编辑
export function getServiceEdit(data) {
  return request({
    url: '/main/service/update',
    method: 'post',
    data
  })
}
// 删除
export function getServiceDel(data) {
  return request({
    url: '/main/service/delete',
    method: 'get',
    params: data
  })
}