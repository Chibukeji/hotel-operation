import request from '@/utils/request'

// 列表
export function getScreenTagsList(data) {
  return request({
    url: '/main/screen_tags/list',
    method: 'get',
    params: data
  })
}
// 添加
export function getScreenTagsAdd(data) {
  return request({
    url: '/main/screen_tags/add',
    method: 'post',
    data
  })
}
// 编辑
export function getScreenTagsEdit(data) {
  return request({
    url: '/main/screen_tags/update',
    method: 'post',
    data
  })
}
// 删除
export function getScreenTagsDel(data) {
  return request({
    url: '/main/screen_tags/delete',
    method: 'get',
    params: data
  })
}
//获取父级
export function getScreenTagsParent(data) {
    return request({
      url: '/main/screen_tags/getParentList',
      method: 'get',
      params: data
    })
  }
//获取数据列表
export function getScreenTagsDetailList(data) {
  return request({
    url: '/main/screen_tags_hotel/list',
    method: 'get',
    params: data
  })
}
//数据列表添加
export function getScreenTagsDetailListAdd(data) {
    return request({
      url: '/main/screen_tags_hotel/add',
      method: 'post',
      data
    })
  }
  //数据列表删除
export function getScreenTagsDetailListDel(data) {
    return request({
      url: '/main/screen_tags_hotel/delete',
      method: 'get',
      params: data
    })
  }