import request from '@/utils/request'

// 列表
export function getHotCityList(data) {
  return request({
    url: '/main/hot_city/list',
    method: 'get',
    params: data
  })
}
// 添加
export function getHotCityAdd(data) {
  return request({
    url: '/main/hot_city/add',
    method: 'post',
    data
  })
}
// 编辑
export function getHotCityEdit(data) {
  return request({
    url: '/main/hot_city/update',
    method: 'post',
    data
  })
}
// 删除
export function getHotCityDel(data) {
  return request({
    url: '/main/hot_city/delete',
    method: 'get',
    params: data
  })
}
//获取默认城市
export function getDefaultCity(data) {
  return request({
    url: '/main/hot_city/getDefault',
    method: 'get',
    params: data
  })
}
//设置默认城市
export function setDefaultCity(data) {
  return request({
    url: '/main/hot_city/setDefault',
    method: 'post',
    data
  })
}