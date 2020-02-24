import request from '@/utils/request'

export function businessChannelList(query) {
  return request({
    url: '/statistics/business-channel-list',
    method: 'get',
    params: query
  })
}
export function contentList(query) {
  return request({
    url: '/statistics/content-list',
    method: 'get',
    params: query
  })
}
export function pipeList(query) {
  return request({
    url: '/statistics/pipe-list',
    method: 'get',
    params: query
  })
}

export function detail(query) {
  return request({
    url: '/statistics/detail',
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
