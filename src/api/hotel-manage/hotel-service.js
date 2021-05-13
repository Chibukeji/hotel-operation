import request from '@/utils/request'

// 列表
export function getHotelServiceList(data) {
  return request({
    url: '/main/hotel_service/list',
    method: 'get',
    params: data
  })
}
// 添加
export function getHotelServiceAdd(data) {
  return request({
    url: '/main/hotel_service/add',
    method: 'post',
    data
  })
}
// 编辑
export function getHotelServiceEdit(data) {
  return request({
    url: '/main/hotel_service/update',
    method: 'post',
    data
  })
}
// 删除
export function getHotelServiceDel(data) {
  return request({
    url: '/main/hotel_service/delete',
    method: 'get',
    params: data
  })
}