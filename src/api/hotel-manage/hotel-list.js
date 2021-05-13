import request from '@/utils/request'

// 列表
export function getHotelList(data) {
  return request({
    url: '/main/hotel/list',
    method: 'get',
    params: data
  })
}
// 添加
export function getHotelAdd(data) {
  return request({
    url: '/main/hotel/add',
    method: 'post',
    data
  })
}
// 编辑
export function getHotelEdit(data) {
  return request({
    url: '/main/hotel/update',
    method: 'post',
    data
  })
}
// 删除
export function getHotelDel(data) {
  return request({
    url: '/main/hotel/delete',
    method: 'get',
    params: data
  })
}
//酒店星级
export function getHotelRank(data) {
    return request({
      url: '/main/hotel/getHotelRank',
      method: 'get',
      params: data
    })
}
//酒店分类
export function getHotelCate(data) {
    return request({
      url: '/main/hotel/getHotelCate',
      method: 'get',
      params: data
    })
}
//酒店设施
export function getHotelService(data) {
    return request({
      url: '/main/hotel/getHotelService',
      method: 'get',
      params: data
    })
}
//运营
export function getHotelAdmin(data) {
    return request({
      url: '/main/hotel/getAdmin',
      method: 'get',
      params: data
    })
}
//导出数据
export function getHotelExportExcel(data) {
  return request({
    url: '/main/hotel/exportExcel',
    method: 'get',
    params: data
  })
}
//上下架
export function getHotelStatus(data) {
  return request({
    url: '/main/hotel/editHotelShow',
    method: 'get',
    params: data
  })
}
//获取酒店相册列表
export function getHotelPhoto(data) {
  return request({
    url: '/main/hotel_photo_attr/list',
    method: 'get',
    params: data
  })
}
//专属积分列表
export function getScoreList(data) {
  return request({
    url: '/main/hotel/getScoreList',
    method: 'get',
    params: data
  })
}
//充值专属积分
export function rechargeScore(data) {
  return request({
    url: '/main/hotel/giveExclusiveScore',
    method: 'post',
    data
  })
}
//获取员工列表
export function hotelAccountList(data) {
  return request({
    url: '/main/hotel/getHotelMember',
    method: 'get',
    params: data
  })
}
//获取酒店二维码
export function getHotelQrcode(data) {
  return request({
    url: '/main/hotel/getHotelQrcode',
    method: 'get',
    params: data
  })
}