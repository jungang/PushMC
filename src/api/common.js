import request from '@/utils/request'

export function sourceOption(query) {
  return request({
    url: '/common/options',
    method: 'get',
    params: query
  })
}

export function channelType(query) {
/*  return request({
    url: '/common/channel-type',
    method: 'get',
    params: query
  })*/
  return new Promise((resolve, reject) => {
    const res = {
      'data': {
        'items': [
          {
            'type': 'gocom',
            'label': 'goCom',
            'id': 2
          }
        ]
      },
      'code': 20000
    }
    resolve(res)
  })
}

export function domain(query) {
  return request({
    url: '/common/domain',
    method: 'get',
    params: query
  })
}

export function options(query) {
  return request({
    url: '/common/options',
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
    url: '/business-channel/third/list',
    method: 'get',
    params: query
  })
}

// 推送模板列表
export function pushTemplate(query) {
/*  return request({
    url: '/common/push-template',
    method: 'get',
    params: query
  })*/

  return new Promise((resolve, reject) => {
    const res = {
      'data': {
        'items': [
          {
            'key': 'tmp1',
            'label': '模板-效件如属统',
            'id': 1
          },
          {
            'key': 'tmp2',
            'label': '模板-学角效个',
            'id': 2
          },
          {
            'key': 'tmp3',
            'label': '模板-事问即影参选',
            'id': 3
          },
          {
            'key': 'tmp4',
            'label': '模板-片说矿料铁是',
            'id': 4
          },
          {
            'key': 'tmp5',
            'label': '模板-按各知外',
            'id': 5
          },
          {
            'key': 'tmp6',
            'label': '模板-较指需人',
            'id': 6
          }
        ]
      },
      'code': 20000
    }
    resolve(res)
  })
}
