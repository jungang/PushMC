import request from '@/utils/request'

export function pushChannelList(query) {
  return request({
    url: '/push-channel/list',
    method: 'get',
    params: query
  })
}
export function detail(query) {
  return request({
    url: '/push-channel/detail',
    method: 'get',
    params: query
  })
}

export function dele(id, status) {
  return request({
    url: '/push-channel/delete',
    method: 'delete',
    params: { id, status }
  })
}

export function fetchSource(id) {
  return request({
    url: '/push-channel/detail',
    method: 'get',
    params: { id }
  })
}

export function fetchPv(pv) {
  return request({
    url: '/push-channel/pv',
    method: 'get',
    params: { pv }
  })
}

export function create(data) {
  return request({
    url: '/push-channel/create',
    method: 'post',
    data: data
  })
}

export function update(data) {
  return request({
    url: '/push-channel/update',
    method: 'put',
    data: data
  })
}

export function changeStatus(id, status) {
  return request({
    url: '/push-channel/status',
    method: 'put',
    params: { id, status }
  })
}
