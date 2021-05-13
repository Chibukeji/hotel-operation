import request from '@/utils/request'

// 列表
export function getHouseTypeList(data) {
  return request({
    url: '/main/hotel_room/list',
    method: 'get',
    params: data
  })
}
// 添加
export function getHouseTypeAdd(data) {
  return request({
    url: '/main/hotel_room/add',
    method: 'post',
    data
  })
}
// 编辑
export function getHouseTypeEdit(data) {
  return request({
    url: '/main/hotel_room/update',
    method: 'post',
    data
  })
}
// 删除
export function getHouseTypeDel(data) {
  return request({
    url: '/main/hotel_room/delete',
    method: 'get',
    params: data
  })
}
//房间属性
export function getRoomAttr(data) {
    return request({
      url: '/main/hotel_room/getRoomAttr',
      method: 'get',
      params: data
    })
}
// 房型报价列表
export function getRoomPriceList(data) {
    return request({
      url: '/main/hotel_room_price/list',
      method: 'get',
      params: data
    })
}
// 房型报价添加
export function getRoomPriceAdd(data) {
    return request({
        url: '/main/hotel_room_price/add',
        method: 'post',
        data
    })
}
// 房型报价编辑
export function getRoomPriceEdit(data) {
    return request({
        url: '/main/hotel_room_price/update',
        method: 'post',
        data
    })
}
// 房型报价删除
export function getRoomPriceDel(data) {
    return request({
        url: '/main/hotel_room_price/delete',
        method: 'get',
        params: data
    })
}
//上下架
export function getHotelRoomStatus(data) {
  return request({
    url: '/main/hotel_room/editHotelRoomShow',
    method: 'get',
    params: data
  })
}