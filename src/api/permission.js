import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/user/role/list',
    method: 'get',
    params: query
  })
}

export function dele(data) {
  return request({
    url: '/user/role/delete',
    method: 'delete',
    params: data
  })
}

export function create(data) {
  return request({
    url: '/user/role',
    method: 'put',
    data: data
  })
}

export function update(data) {
  return request({
    url: '/user/role',
    method: 'put',
    data: data
  })
}

export function allPermission(data) {
  return request({
    url: '/user/permission/list',
    method: 'get',
    data: data
  })
}
