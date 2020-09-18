import request from '@/utils/request'

export function labelFetchList(query) {
  return request({
    url: '/label/list',
    method: 'get',
    params: query
  })
}

export function fetchCategory(query) {
  return request({
    url: '/category/list',
    method: 'get',
    params: query
  })
}

export function fetchLabel(query) {
  return request({
    url: '/label/list',
    method: 'get',
    params: query
  })
}

export function dele(id) {
  return request({
    url: '/label/delete',
    method: 'delete',
    params: { id }
  })
}

export function fetchSource(id) {
  return request({
    url: '/category/detail',
    method: 'get',
    params: { id }
  })
}

export function fetchPv(pv) {
  return request({
    url: '/category/pv',
    method: 'get',
    params: { pv }
  })
}

export function createTag(data) {
  return request({
    url: '/label/create',
    method: 'post',
    data: data
  })
}
export function saveCategory(data) {
  return request({
    url: '/category/create',
    method: 'post',
    data: data
  })
}

export function updateTag(data) {
  return request({
    url: '/label/update',
    method: 'put',
    data: data
  })
}
