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
export function fetchDataItem(query) {
  return request({
    url: '/business-channel/data-item',
    method: 'get',
    params: { data: JSON.stringify(query) }
  })
}
export function searchList(keyWord) {
  return request({
    url: '/business-channel/list',
    method: 'get',
    params: { searchKey: keyWord }
  })
}

export function dele(data) {
  return request({
    url: '/business-channel/delete',
    method: 'delete',
    params: data
  })
}

export function channelDetail(data) {
  return request({
    url: '/business-channel/detail',
    method: 'get',
    params: data
  })
}

export function fetchPv(pv) {
  return request({
    url: '/business-channel/pv',
    method: 'get',
    params: { pv }
  })
}

export function createBusinessChannel(data) {
  return request({
    url: '/business-channel/channel/create',
    method: 'post',
    data: data
  })
}

export function update(data) {
  return request({
    url: '/business-channel/channel/update',
    method: 'post',
    data: data
  })
}

export function subscribe(data) {
  return request({
    url: '/business-channel/book',
    method: 'put',
    data: data
  })
}
