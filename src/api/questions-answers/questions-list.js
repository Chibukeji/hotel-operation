import request from '@/utils/request'

//问题列表
export function getQuestionsList(data) {
  return request({
    url: '/main/hotel_questions/list',
    method: 'get',
    params: data
  })
}
//删除
export function getQuestionsDel(data) {
    return request({
      url: '/main/hotel_questions/delete',
      method: 'get',
      params: data
    })
  }
//修改审核状态
export function getQuestionsUpdate(data) {
    return request({
      url: '/main/hotel_questions/update',
      method: 'post',
      data
    })
}
//回复接口
export function getAnswerAdd(data) {
  return request({
    url: '/main/hotel_answer/add',
    method: 'post',
    data
  })
}
//问题回答列表
export function getAnswerList(data) {
    return request({
      url: '/main/hotel_answer/list',
      method: 'get',
      params: data
    })
}
//审核回复内容
export function getAnswerEdit(data) {
  return request({
    url: '/main/hotel_answer/update',
    method: 'post',
    data
  })
}
//删除回复内容
export function getAnswerDel(data) {
  return request({
    url: '/main/hotel_answer/delete',
    method: 'get',
    params: data
  })
}