import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/push-content/list',
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

export function fetchTables(query) {
  return request({
    url: '/push-content/tables',
    method: 'get',
    params: query
  })
}
export function searchList(query) {
  return request({
    url: '/push-content/list',
    method: 'get',
    params: query
  })
}

export function dele(id, status) {
  return request({
    url: '/push-content/delete',
    method: 'delete',
    params: { id, status }
  })
}

export function fetchSource(id) {
  return request({
    url: '/push-content/detail',
    method: 'get',
    params: { id }
  })
}

export function fetchPv(pv) {
  return request({
    url: '/push-content/pv',
    method: 'get',
    params: { pv }
  })
}

export function create(data) {
  return request({
    url: '/push-content/create',
    method: 'post',
    data: data
  })
}

export function update(data) {
  return request({
    url: '/push-content/update',
    method: 'put',
    data: data
  })
}
