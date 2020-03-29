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

export function getUserInfo(token) {
  return request({
    url: '/user/login',
    method: 'get',
    params: { app_token: token }
  })
}

export function updateFilter(data) {
  return request({
    url: '/home/data/filter',
    method: 'put',
    data: data
  })
}
export function chartFilter(params) {
  return request({
    url: '/home/data/filter',
    method: 'get',
    params: { params }
  })
}

export function chartData(params) {
  return request({
    url: '/home/data',
    method: 'POST',
    params: { params }
  })
/*
  return new Promise((resolve, reject) => {
    const res = {
      'code': 20000,
      'data': {
        series1: [
          { value: 235, name: '推送总数' },
          { value: 274, name: '短信推送总数' },
          { value: 310, name: '微信推送总数' },
          { value: 335, name: 'APP推送总数' },
          { value: 400, name: 'gocom推送总数' }
        ],
        series2: [30, 50, 100, 130, 180, 190, 200]
      }
    }
    resolve(res)
  })*/
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
