import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/user/role/list',
    method: 'get',
    params: query
  })
}

export function dele(id, status) {
  return request({
    url: '/user/permission/delete',
    method: 'delete',
    params: { id, status }
  })
}

export function create(data) {
  return request({
    url: '/user/users',
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
