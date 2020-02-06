import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/category/list',
    method: 'get',
    params: query
  })
}

export function dele(id, status) {
  return request({
    url: '/category/delete',
    method: 'post',
    params: { id, status }
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
    url: '/category/create',
    method: 'post',
    data: { data: data }
  })
}
export function saveCategory(data) {
  return request({
    url: '/category/createCategory',
    method: 'post',
    data: { data: data }
  })
}

export function updateTag(data) {
  return request({
    url: '/category/update',
    method: 'post',
    data: { data: data }
  })
}
