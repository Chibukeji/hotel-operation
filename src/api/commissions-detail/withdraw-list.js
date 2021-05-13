import request from '@/utils/request'

// 列表
export function getWithdrawList(data) {
  return request({
    url: '/main/member_withdraw/list',
    method: 'get',
    params: data
  })
}
// 审核
export function getWithdrawAudit(data) {
  return request({
    url: '/main/member_withdraw/audit',
    method: 'post',
    data
  })
}
// 打款
export function getWithdrawPayment(data) {
  return request({
    url: '/main/member_withdraw/payment',
    method: 'post',
    data
  })
}
// 导出
export function getWithdrawExport(data) {
  return request({
    url: '/main/member_withdraw/exportExcel',
    method: 'get',
    params: data
  })
}