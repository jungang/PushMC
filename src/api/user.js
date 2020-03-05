import request from '@/utils/request'
export function xxx(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}
export function login(data) {
/*  return request({
    url: '/user/login',
    method: 'post',
    data
  })*/

  return new Promise((resolve, reject) => {
    const res = {
      'code': 20000,
      'data': {
        'token': 1
      },
      'msg': 'Login successfully'
    }
    resolve(res)
  })
}

export function getInfo(token) {
  return request({
    url: '/user/login',
    method: 'get',
    params: { app_token: token }
  })
}
export function getPermission(roles) {
/*
  return request({
    url: '/user/permission',
    method: 'get',
    params: { roles }
  })
*/

  return new Promise((resolve, reject) => {
    const res = {
      'code': 20000,
      'data': {
        'roleTypes': [
          {
            'id': '07',
            'path': '/push-target'
          },
          {
            'id': '08',
            'path': '/message-template'
          },
          {
            'id': '09',
            'path': '/message-push'
          }
        ]
      }
    }
    resolve(res)
  })
}

export function logout() {
/*  return request({
    url: '/user/logout',
    method: 'post'
  })*/

  return new Promise((resolve, reject) => {
    const res = {
      'code': 20000
    }
    resolve(res)
  })
}
