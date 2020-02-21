import request from '@/utils/request'

export function list(query) {
  return request({
    url: '/push-content/examine/list',
    method: 'get',
    params: query
  })
}

export function detail(query) {
  return request({
    url: '/push-content/detail',
    method: 'get',
    params: query
  })
}

export function action(query) {
  return request({
    url: '/examine/action',
    method: 'put',
    params: query
  })
}
