import request from '@/utils/request'

// 列表
export function getMemberList(data) {
  return request({
    url: '/main/member/list',
    method: 'get',
    params: data
  })
}
//搜索会员列表
export function getSearchMemberList(data) {
  return request({
    url: '/main/member/seachMember',
    method: 'get',
    params: data
  })
}
// 编辑
export function getMemberEdit(data) {
  return request({
    url: '/main/member/update',
    method: 'post',
    data
  })
}
//会员上周和本周注册数接口
export function getMemberWeekNumsList(data) {
  return request({
    url: '/main/member/getWeekNums',
    method: 'get',
    params: data
  })
}
//订单详情
export function getMemberOrderList(data) {
  return request({
    url: '/main/member_order/list',
    method: 'get',
    params: data
  })
}
//团队人员
export function getMemberTeamList(data) {
  return request({
    url: '/main/member/getTeamList',
    method: 'get',
    params: data
  })
}
//团队订单
export function getMemberTeamOrderList(data) {
  return request({
    url: '/main/member/getTeamOrder',
    method: 'get',
    params: data
  })
}
//团队收益
export function getMemberTeamCommissionList(data) {
  return request({
    url: '/main/member/getTeamCommission',
    method: 'get',
    params: data
  })
}
//充值
export function getMemberRecharge(data) {
  return request({
    url: '/main/member/recharge',
    method: 'get',
    params: data
  })
}
//导出数据
export function getMemberExportExcel(data) {
  return request({
    url: '/main/member/exportExcel',
    method: 'get',
    params: data
  })
}
//导出团队人员
export function getTeamListExportExcel(data) {
  return request({
    url: '/main/member/exportTeamList',
    method: 'get',
    params: data
  })
}
//导出团队订单
export function getTeamOrderExportExcel(data) {
  return request({
    url: '/main/member/exportTeamOrder',
    method: 'get',
    params: data
  })
}
//导出团队收益
export function getTeamCommissionExportExcel(data) {
  return request({
    url: '/main/member/exportTeamCommission',
    method: 'get',
    params: data
  })
}
//来源酒店
export function getmemberSource(data) {
  return request({
    url: '/main/member/memberSource',
    method: 'get',
    params: data
  })
}
//余额记录
export function getMoneySource(data) {
  return request({
    url: '/main/member_money/list',
    method: 'get',
    params: data
  })
}
//分时积分记录
export function getDivtimeSource(data) {
  return request({
    url: '/main/divtime_score/list',
    method: 'get',
    params: data
  })
}
//专属积分记录
export function getExclusiveSource(data) {
  return request({
    url: '/main/exclusive_score/list',
    method: 'get',
    params: data
  })
}
//金币记录
export function getGoldSource(data) {
  return request({
    url: '/main/gold/list',
    method: 'get',
    params: data
  })
}