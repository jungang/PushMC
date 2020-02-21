import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/message-template/list',
    method: 'get',
    params: query
  })
}

export function detail(query) {
  return request({
    url: '/message-template/detail',
    method: 'get',
    params: query
  })
}

export function changeStatus(id, status) {
  return request({
    url: '/message-template/status',
    method: 'put',
    params: { id, status }
  })
}

export function fetchTables(query) {
  return request({
    url: '/message-template/tables',
    method: 'get',
    params: query
  })
}
export function searchList(keyWord) {
  return request({
    url: '/message-template/list',
    method: 'get',
    params: { word: keyWord }
  })
}

export function dele(id, status) {
  return request({
    url: '/message-template/delete',
    method: 'delete',
    params: { id, status }
  })
}

export function fetchSource(id) {
  return request({
    url: '/message-template/detail',
    method: 'get',
    params: { id }
  })
}

export function fetchPv(pv) {
  return request({
    url: '/message-template/pv',
    method: 'get',
    params: { pv }
  })
}

export function create(data) {
  return request({
    url: '/message-template/create',
    method: 'post',
    data: data
  })
}

export function updateSource(data) {
  return request({
    url: '/message-template/update',
    method: 'put',
    data: data
  })
}
