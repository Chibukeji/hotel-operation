import request from '@/utils/request'

// 列表
export function getHotelStarList(data) {
  return request({
    url: '/main/hotel_rank/list',
    method: 'get',
    params: data
  })
}
// 添加
export function getHotelStarAdd(data) {
  return request({
    url: '/main/hotel_rank/add',
    method: 'post',
    data
  })
}
// 编辑
export function getHotelStarEdit(data) {
  return request({
    url: '/main/hotel_rank/update',
    method: 'post',
    data
  })
}
// 删除
export function getHotelStarDel(data) {
  return request({
    url: '/main/hotel_rank/delete',
    method: 'get',
    params: data
  })
}