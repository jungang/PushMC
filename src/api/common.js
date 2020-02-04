import request from '@/utils/request'

export function channelType(query) {
  return request({
    url: '/common/channel-type',
    method: 'get',
    params: query
  })
}

export function department(query) {
  return request({
    url: '/common/department',
    method: 'get',
    params: query
  })
}

// 查询人员列表
export function searchPersons(query) {
  return request({
    url: '/common/search-persons',
    method: 'get',
    params: query
  })
}

// 频道订阅列表
export function channelSubscribe(query) {
  return request({
    url: '/common/channel-Subscribe',
    method: 'get',
    params: query
  })
}

// 推送模板列表
export function pushTemplate(query) {
  return request({
    url: '/common/push-template',
    method: 'get',
    params: query
  })
}
