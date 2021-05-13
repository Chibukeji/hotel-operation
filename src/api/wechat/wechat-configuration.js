import request from '@/utils/request'

//配置信息
export function getWechatInfo(data) {
  return request({
    url: '/main/wechat/info',
    method: 'get',
    params:data
  })
}
//修改配置信息
export function wechatInfoEdit(data) {
    return request({
      url: '/main/wechat/update',
      method: 'post',
      data
    })
  }