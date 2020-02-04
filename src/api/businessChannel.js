import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/business-channel/list',
    method: 'get',
    params: query
  })
}

export function fetchTables(query) {
  return request({
    url: '/business-channel/tables',
    method: 'get',
    params: query
  })
}
export function searchList(keyWord) {
  return request({
    url: '/business-channel/list',
    method: 'get',
    params: { word: keyWord }
  })
}

export function dele(id, status) {
  return request({
    url: '/business-channel/delete',
    method: 'post',
    params: { id, status }
  })
}

export function fetchSource(id) {
  return request({
    url: '/business-channel/detail',
    method: 'get',
    params: { id }
  })
}

export function fetchPv(pv) {
  return request({
    url: '/business-channel/pv',
    method: 'get',
    params: { pv }
  })
}

export function createSource(data) {
  return request({
    url: '/business-channel/create',
    method: 'post',
    data: { data: data }
  })
}

export function updateSource(data) {
  return request({
    url: '/business-channel/update',
    method: 'post',
    data: { data: data }
  })
}

export function subscribe(data, opt) {
  return request({
    url: '/business-channel/subscribe',
    method: 'post',
    data: { data: data, opt: opt }
  })
}
