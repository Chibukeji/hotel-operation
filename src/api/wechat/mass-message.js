import request from '@/utils/request'

// 列表
export function getSengMessageList(data) {
  return request({
    url: '/main/group_send_message/list',
    method: 'get',
    params: data
  })
}
// 新增
export function getSengMessageAdd(data) {
  return request({
    url: '/main/group_send_message/add',
    method: 'post',
    data
  })
}
//删除
export function getSengMessageDel(data) {
  return request({
    url: '/main/group_send_message/delete',
    method: 'get',
    params:data
  })
}