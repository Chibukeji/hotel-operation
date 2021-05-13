import request from '@/utils/request'

// 列表
export function getArtileCateList(data) {
  return request({
    url: '/main/article_cate/list',
    method: 'get',
    params: data
  })
}
// 添加
export function getArtileCateAdd(data) {
  return request({
    url: '/main/article_cate/add',
    method: 'post',
    data
  })
}
// 编辑
export function getArtileCateEdit(data) {
  return request({
    url: '/main/article_cate/update',
    method: 'post',
    data
  })
}
// 删除
export function getArtileCateDel(data) {
  return request({
    url: '/main/article_cate/delete',
    method: 'get',
    params: data
  })
}