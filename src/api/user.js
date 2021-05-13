import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/main/login',
    method: 'post',
    data
  })
}

export function logout() {
  return request({
    url: '/main/logout',
    method: 'get'
  })
}

// 获取菜单
export function getMenu(data) {
  return request({
    url: '/main/menus',
    method: 'get',
    params: data
  })
}
//获取登录信息
export function getloginInfo(data) {
  return request({
    url: 'main/admin_info',
    method: 'get',
    params:data
  })
}