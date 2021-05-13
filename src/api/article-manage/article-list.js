import request from '@/utils/request'

// 列表
export function getArticleList(data) {
  return request({
    url: '/main/article/list',
    method: 'get',
    params: data
  })
}
// 添加
export function getArticleAdd(data) {
  return request({
    url: '/main/article/add',
    method: 'post',
    data
  })
}
// 编辑
export function getArticleEdit(data) {
  return request({
    url: '/main/article/update',
    method: 'post',
    data
  })
}
// 删除
export function getArticleDel(data) {
  return request({
    url: '/main/article/delete',
    method: 'get',
    params: data
  })
}
//获取文章详情
export function getArticleInfo(data) {
  return request({
    url: '/main/article/info',
    method: 'get',
    params:data
  })
}