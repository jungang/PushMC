import request from '@/utils/request'

export function fetchList(query) {
  return request({
    // url: '/source/list', //rap2
    url: '/source/page',
    method: 'get',
    params: query
  })
}
export function option(query) {
  return request({
    url: '/source/data-source-options',
    method: 'get',
    params: query
  })
}

export function changeStatus(id, status) {
  return request({
    url: '/source/status',
    method: 'post',
    params: { id, status }
  })
}

export function fetchSource(id) {
  return request({
    url: '/source/detail',
    method: 'get',
    params: { id }
  })
}

export function fetchPv(pv) {
  return request({
    url: '/source/pv',
    method: 'get',
    params: { pv }
  })
}

export function createSource(data) {
  return request({
    url: '/source/create',
    method: 'post',
    data: data
  })
}

export function updateSource(data) {
  return request({
    url: '/source/update',
    method: 'post',
    data: { data: data }
  })
}

export function detail(data) {
  return request({
    url: '/source/detail',
    method: 'get',
    params: { data: data }
  })
}
