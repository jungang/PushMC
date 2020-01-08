import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/push-target/list',
    method: 'get',
    params: query
  })
}

export function dele(id, status) {
  return request({
    url: '/push-target/delete',
    method: 'post',
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

export function createSource(data) {
  return request({
    url: '/push-target/create',
    method: 'post',
    data: { data: data }
  })
}

export function update(data) {
  return request({
    url: '/push-target/update',
    method: 'post',
    data: { data: data }
  })
}
