import request from '@/utils/request'

// 列表
export function getMemberOrderList(data) {
  return request({
    url: '/main/member_order/list',
    method: 'get',
    params: data
  })
}
//设为已读
export function getMemberOrderReadList(data) {
  return request({
    url: '/main/member_order/setRead',
    method: 'get',
    params: data
  })
}
//获取子订单
export function getMemberOrderChildList(data) {
  return request({
    url: '/main/member_order/orderChild',
    method: 'get',
    params: data
  })
}
//获取订单日志
export function getMemberOrderLogList(data) {
  return request({
    url: '/main/member_order/orderLog',
    method: 'get',
    params: data
  })
}
//入住人信息
export function getStayPeopleList(data) {
  return request({
    url: '/main/member_order/getLinkName',
    method: 'get',
    params: data
  })
}
//退款订单
export function getRefundOrderList(data) {
  return request({
    url: '/main/member_order/getOrderRefund',
    method: 'get',
    params: data
  })
}
//订单分佣
export function getOrderCommissionsList(data) {
  return request({
    url: '/main/commissions/list',
    method: 'get',
    params: data
  })
}
//统计金额
export function totalByDate(data) {
  return request({
    url: '/main/member_order/totalByDate',
    method: 'get',
    params: data
  })
}
//导出数据
export function getOrderExportExcel(data) {
  return request({
    url: '/main/member_order/exportExcel',
    method: 'get',
    params: data
  })
}

//获取会员卡订单列表
export function getMemberCardOrderList(data) {
  return request({
    url: '/main/vip_order/list',
    method: 'get',
    params: data
  })
}
//获取会员卡等级
export function getMemberLevel(data) {
  return request({
    url: '/main/vip_order/memberLevel',
    method: 'get',
    params: data
  })
}
//获取订单打印信息
export function getPrintInfo(data) {
  return request({
    url: '/main/member_order/getPrintInfo',
    method: 'get',
    params:data
  })
}