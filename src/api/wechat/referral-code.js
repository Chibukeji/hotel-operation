import request from '@/utils/request'

//获取信息
export function getRecommendCode(data) {
  return request({
    url: '/main/recommend_poster/info',
    method: 'get',
    params:data
  })
}
//保存图片信息
export function getRecommendCodeUpdate(data) {
    return request({
        url: '/main/recommend_poster/update',
        method: 'post',
        data
    })
}
//删除背景图片
export function delBackgroundImg(data) {
  return request({
      url: '/main/recommend_poster/delBackgroundImg',
      method: 'post',
      data
  })
}