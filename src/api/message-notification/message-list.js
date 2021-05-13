import request from '@/utils/request'

// 列表
export function getMessageList(data) {
  return request({
    url: '/main/message/list',
    method: 'get',
    params: data
  })
}
// 删除
export function getMessageDel(data) {
  return request({
    url: '/main/message/delete',
    method: 'get',
    params: data
  })
}