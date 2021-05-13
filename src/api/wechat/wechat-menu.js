import request from '@/utils/request'

//获取公众号菜单
export function getWechatMenu(data) {
  return request({
    url: '/main/wechat/getMenu',
    method: 'get',
    params:data
  })
}
//获取公众号默认菜单
export function getWechatDefMenuMenu(data) {
    return request({
      url: '/main/wechat/getDefMenu',
      method: 'get',
      params:data
    })
}
//保存公众号菜单
export function saveWechatMenu(data) {
    return request({
      url: '/main/wechat/setMenu',
      method: 'post',
      data
    })
}
//获取常用链接地址
export function getComLink(data) {
    return request({
      url: '/main/wechat/getComLink',
      method: 'get',
      params:data
    })
}
// 获取关键字回复内容
export function getKeyWord(data) {
  return request({
    url: '/main/wechat_key_word/info',
    method: 'get',
    params:data
  })
}