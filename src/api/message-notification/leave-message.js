import request from '@/utils/request'

// 列表
export function getLeaveMessageList(data) {
  return request({
    url: '/main/message_member/list',
    method: 'get',
    params: data
  })
}
// 删除
export function getLeaveMessageDel(data) {
  return request({
    url: '/main/message_member/delete',
    method: 'get',
    params: data
  })
}
//回复消息
export function getLeaveMessageReply(data) {
    return request({
      url: '/main/message_member/reply',
      method: 'post',
      data
    })
  }