import request from '@/utils/request'

// 列表
export function getMerchantList(data) {
  return request({
    url: '/main/merch/list',
    method: 'get',
    params: data
  })
}
// 添加
export function getMerchantAdd(data) {
  return request({
    url: '/main/merch/add',
    method: 'post',
    data
  })
}
// 编辑
export function getMerchantEdit(data) {
  return request({
    url: '/main/merch/update',
    method: 'post',
    data
  })
}
// 删除
export function getMerchantDel(data) {
  return request({
    url: '/main/merch/delete',
    method: 'get',
    params: data
  })
}
//经营范围
export function getBusinessScopeList(data) {
    return request({
      url: '/main/merch/getScope',
      method: 'get',
      params: data
    })
}
//商家分类
export function getMerchantClassifyList(data) {
    return request({
      url: '/main/merch/getMerchCate',
      method: 'get',
      params: data
    })
}
//导出数据
export function getMerchantExportExcel(data) {
  return request({
    url: '/main/merch/exportExcel',
    method: 'get',
    params: data
  })
}