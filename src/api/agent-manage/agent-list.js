import request from '@/utils/request'

// 列表
export function getAgentList(data) {
  return request({
    url: '/main/agent/list',
    method: 'get',
    params: data
  })
}
// 添加
export function getAgentAdd(data) {
  return request({
    url: '/main/agent/add',
    method: 'post',
    data
  })
}
// 编辑
export function getAgentEdit(data) {
  return request({
    url: '/main/agent/update',
    method: 'post',
    data
  })
}
// 删除
export function getAgentDel(data) {
  return request({
    url: '/main/agent/delete',
    method: 'get',
    params: data
  })
}
//获取分润比例
export function getRate(data) {
  return request({
    url: '/main/agent/getRate',
    method: 'get',
    params: data
  })
}
//搜索地址
export function searchArea(data) {
  return request({
    url: '/main/agent/searchArea',
    method: 'get',
    params: data
  })
}
//获取下级代理
export function getAgentChild(data) {
  return request({
    url: '/main/agent/getAgentChild',
    method: 'get',
    params: data
  })
}