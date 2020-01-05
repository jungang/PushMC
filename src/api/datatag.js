import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/data-tag/list',
    method: 'get',
    params: query
  })
}

export function saveTag(data) {
  return request({
    url: '/data-tag/save-tag',
    method: 'post',
    params: { data: data }
  })
}
