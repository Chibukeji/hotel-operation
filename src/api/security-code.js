import request from '@/utils/request'

//核对安全码
export function checkSafePwd(data) {
    return request({
      url: '/main/checkSafePassword',
      method: 'get',
      params:data
    })
  }