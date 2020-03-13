import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/business-channel/list',
    method: 'get',
    params: query
  })
}

export function changeStatus(id, status) {
  return request({
    url: '/business-channel/status',
    method: 'put',
    params: { id, status }
  })
}

export function detail(query) {
  return request({
    url: '/business-channel/detail',
    method: 'get',
    params: query
  })
}
export function copy(query) {
  return request({
    url: '/business-channel/detail',
    method: 'get',
    params: query
  })
}

export function channelList(query) {
  return request({
    url: '/business-channel/list',
    method: 'get',
    params: query
  })
}

export function groups(query) {
  return request({
    url: '/push-target/list',
    method: 'get',
    params: query
  })
}

export function contentPushList(query) {
  return request({
    url: '/channel-push/content-push-list',
    method: 'get',
    params: query
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
    params: { searchKey: keyWord }
  })
}

export function dele(id, status) {
  return request({
    url: '/business-channel/delete',
    method: 'delete',
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
    url: '/business-channel/create',
    method: 'post',
    data: data
  })
}

export function updateChannel(data) {
  return request({
    url: '/business-channel/update',
    method: 'post',
    data: data
  })
}
export function copyChannel(data) {
  return request({
    url: '/business-channel/copy',
    method: 'post',
    data: data
  })
}

export function push(data) {
  return request({
    url: '/business-channel/push',
    method: 'post',
    data: data
  })
}

export function unPush(data, opt) {
  return request({
    url: '/channel-push/un-push',
    method: 'post',
    data: { data: data, opt: opt }
  })
}
