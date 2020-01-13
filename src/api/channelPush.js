import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/channel-push/list',
    method: 'get',
    params: query
  })
}

export function changeStatus(id, status) {
  return request({
    url: '/channel-push/status',
    method: 'post',
    params: { id, status }
  })
}

export function fetchTables(query) {
  return request({
    url: '/channel-push/tables',
    method: 'get',
    params: query
  })
}
export function searchList(keyWord) {
  return request({
    url: '/channel-push/list',
    method: 'get',
    params: { word: keyWord }
  })
}

export function dele(id, status) {
  return request({
    url: '/channel-push/delete',
    method: 'post',
    params: { id, status }
  })
}

export function fetchSource(id) {
  return request({
    url: '/channel-push/detail',
    method: 'get',
    params: { id }
  })
}

export function fetchPv(pv) {
  return request({
    url: '/channel-push/pv',
    method: 'get',
    params: { pv }
  })
}

export function createSource(data) {
  return request({
    url: '/channel-push/create',
    method: 'post',
    data: { data: data }
  })
}

export function updateSource(data) {
  return request({
    url: '/channel-push/update',
    method: 'post',
    data: { data: data }
  })
}
