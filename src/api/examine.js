import request from '@/utils/request'

export function list(query) {
  return request({
    url: '/examine/list',
    method: 'get',
    params: query
  })
}

export function detail(query) {
  return request({
    url: '/examine/detail',
    method: 'get',
    params: query
  })
}

export function action(query) {
  return request({
    url: '/examine/action',
    method: 'post',
    params: query
  })
}
