import request from '@/utils/request'

// 列表
export function getRecommendList(data) {
  return request({
    url: '/main/recommend/list',
    method: 'get',
    params: data
  })
}
// 添加
export function getRecommendAdd(data) {
  return request({
    url: '/main/recommend/add',
    method: 'post',
    data
  })
}
// 编辑
export function getRecommendEdit(data) {
  return request({
    url: '/main/recommend/update',
    method: 'post',
    data
  })
}
// 删除
export function getRecommendDel(data) {
  return request({
    url: '/main/recommend/delete',
    method: 'get',
    params: data
  })
}
//获取数据列表
export function getRecommendDataList(data) {
  return request({
    url: '/main/recommend_list/list',
    method: 'get',
    params: data
  })
}
//保存数据列表
export function getRecommendDataEdit(data) {
  return request({
    url: '/main/recommend_list/addRecommendList',
    method: 'post',
    data
  })
}