import request from '@/utils/request'

// 列表
export function getCarouselList(data) {
  return request({
    url: '/main/carousel/list',
    method: 'get',
    params: data
  })
}
// 添加
export function getCarouselAdd(data) {
  return request({
    url: '/main/carousel/add',
    method: 'post',
    data
  })
}
// 编辑
export function getCarouselEdit(data) {
  return request({
    url: '/main/carousel/update',
    method: 'post',
    data
  })
}
// 删除
export function getCarouselDel(data) {
  return request({
    url: '/main/carousel/delete',
    method: 'get',
    params: data
  })
}