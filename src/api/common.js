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
