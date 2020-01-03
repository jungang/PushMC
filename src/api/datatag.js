import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/data-tag/list',
    method: 'get',
    params: query
  })
}

export function changeStatus(id, status) {
  return request({
    url: '/data-tag/status',
    method: 'post',
    params: { id, status }
  })
}

export function fetchSource(id) {
  return request({
    url: '/data-tag/detail',
    method: 'get',
    params: { id }
  })
}

export function fetchPv(pv) {
  return request({
    url: '/data-tag/pv',
    method: 'get',
    params: { pv }
  })
}

export function createSource(data) {
  return request({
    url: '/data-tag/create',
    method: 'post',
    data: { data: data }
  })
}

export function updateSource(data) {
  return request({
    url: '/data-tag/update',
    method: 'post',
    data: { data: data }
  })
}
