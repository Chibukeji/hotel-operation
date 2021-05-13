import request from '@/utils/request'

// 列表
export function getHotelCommentList(data) {
  return request({
    url: '/main/comment_attr/list',
    method: 'get',
    params: data
  })
}
// 添加
export function getHotelCommentAdd(data) {
  return request({
    url: '/main/comment_attr/add',
    method: 'post',
    data
  })
}
// 编辑
export function getHotelCommentEdit(data) {
  return request({
    url: '/main/comment_attr/update',
    method: 'post',
    data
  })
}
// 删除
export function getHotelCommentDel(data) {
  return request({
    url: '/main/comment_attr/delete',
    method: 'get',
    params: data
  })
}