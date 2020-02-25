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
/*  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })*/

  return new Promise((resolve, reject) => {
    const res = {
      'code': 20000,
      'data': {
        'roles': [
          'admin'
        ],
        'introduction': 'I am a super administrator',
        'avatar': 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
        'name': '钱超'
      }
    }
    resolve(res)
  })
}
export function getPermission(roles) {
/*  return request({
    url: '/user/permission',
    method: 'get',
    params: { roles }
  })*/

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
