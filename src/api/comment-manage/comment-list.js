import request from '@/utils/request'

// 列表
export function getCommentList(data) {
  return request({
    url: '/main/member_comments/list',
    method: 'get',
    params: data
  })
}
// 编辑
export function getCommentEdit(data) {
  return request({
    url: '/main/member_comments/update',
    method: 'post',
    data
  })
}
//删除
export function getCommentDel(data) {
  return request({
    url: '/main/member_comments/delete',
    method: 'get',
    params:data
  })
}