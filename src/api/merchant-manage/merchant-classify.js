import request from '@/utils/request'

// 列表
export function getMerchantCateList(data) {
  return request({
    url: '/main/merch_cate/list',
    method: 'get',
    params: data
  })
}
// 添加
export function getMerchantCateAdd(data) {
  return request({
    url: '/main/merch_cate/add',
    method: 'post',
    data
  })
}
// 编辑
export function getMerchantCateEdit(data) {
  return request({
    url: '/main/merch_cate/update',
    method: 'post',
    data
  })
}
// 删除
export function getMerchantCateDel(data) {
  return request({
    url: '/main/merch_cate/delete',
    method: 'get',
    params: data
  })
}