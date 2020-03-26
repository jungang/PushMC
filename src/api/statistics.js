import request from '@/utils/request'

export function businessChannelList(query) {
  return request({
    url: '/statistics/list',
    method: 'get',
    params: query
  })
}
export function contentList(query) {
  return request({
    url: '/statistics/list',
    method: 'get',
    params: query
  })
}
export function pipeList(query) {
  return request({
    url: '/statistics/list',
    method: 'get',
    params: query
  })
}

export function detail(query) {
  return request({
    url: '/message/detail/page',
    method: 'get',
    params: query
  })
}

export function download(query) {
  return request({
    url: '/statistics/export',
    method: 'get',
    params: query
  })
}

export function ept(query) {
  return request({
    url: '/statistics/export',
    method: 'get',
    params: query
  })
}
