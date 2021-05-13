import request from '@/utils/request'

// 列表
export function getHotelCateList(data) {
  return request({
    url: '/main/hotel_cate/list',
    method: 'get',
    params: data
  })
}
// 添加
export function getHotelCateAdd(data) {
  return request({
    url: '/main/hotel_cate/add',
    method: 'post',
    data
  })
}
// 编辑
export function getHotelCateEdit(data) {
  return request({
    url: '/main/hotel_cate/update',
    method: 'post',
    data
  })
}
// 删除
export function getHotelCateDel(data) {
  return request({
    url: '/main/hotel_cate/delete',
    method: 'get',
    params: data
  })
}