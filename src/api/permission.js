import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/permission/list',
    method: 'get',
    params: query
  })
}

export function dele(id, status) {
  return request({
    url: '/permission/delete',
    method: 'post',
    params: { id, status }
  })
}

export function create(data) {
  return request({
    url: '/permission/create',
    method: 'post',
    data: { data: data }
  })
}

export function update(data) {
  return request({
    url: '/permission/update',
    method: 'post',
    data: { data: data }
  })
}

export function allPermission(data) {
  return request({
    url: '/permission/all',
    method: 'get',
    data: { data: data }
  })
}
