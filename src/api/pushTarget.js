import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/push-target/list',
    method: 'get',
    params: query
  })
}
export function detail(query) {
  return request({
    url: '/push-target/detail',
    method: 'get',
    params: query
  })
}

export function dele(id, status) {
  return request({
    url: '/push-target/delete',
    method: 'delete',
    params: { id, status }
  })
}

export function fetchSource(id) {
  return request({
    url: '/push-target/detail',
    method: 'get',
    params: { id }
  })
}

export function fetchPv(pv) {
  return request({
    url: '/push-target/pv',
    method: 'get',
    params: { pv }
  })
}

export function create(data) {
  return request({
    url: '/push-target/create',
    method: 'post',
    data: data
  })
}

export function update(data) {
  return request({
    url: '/push-target/update',
    method: 'put',
    data: data
  })
}
