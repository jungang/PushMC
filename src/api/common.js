import request from '@/utils/request'

export function sourceOption(query) {
/*  return request({
    url: '/common/options',
    method: 'get',
    params: query
  })*/

  return new Promise((resolve, reject) => {
    const res = {
      'code': 20000,
      'msg': '',
      'data': {
        'dataSourceTypeOptions': [
          {
            'label': 'API',
            'key': 'API'
          },
          /*        {
            'label': 'DB',
            'key': 'DB'
          },*/
          {
            'label': 'webhooks',
            'key': 'webhooks'
          }
        ],
        'updatePlanOptions': {
          'hour': [
            {
              'key': 1,
              'label': '1小时'
            },
            {
              'key': 2,
              'label': '2小时'
            },
            {
              'key': 3,
              'label': '3小时'
            },
            {
              'key': 4,
              'label': '4小时'
            }
          ],
          'times': [
            {
              'key': 1,
              'label': '1次'
            },
            {
              'key': 2,
              'label': '2次'
            },
            {
              'key': 3,
              'label': '3次'
            },
            {
              'key': 4,
              'label': '4次'
            },
            {
              'key': 5,
              'label': '5次'
            }
          ]
        },
        'tagCategory': [
          {
            'key': 'news',
            'label': '新闻'
          },
          {
            'key': 'notice',
            'label': '公告'
          },
          {
            'key': 'business',
            'label': '业务频道'
          }
        ],
        'businessSource': [
          {
            'key': 1,
            'label': '海致大数据1'
          },
          {
            'key': 2,
            'label': '海致大数据2'
          },
          {
            'key': 3,
            'label': '海致大数据3'
          },
          {
            'key': 4,
            'label': '海致大数据4'
          }
        ],
        'tags': [
          {
            'key': 'tag1',
            'label': '标签1'
          },
          {
            'key': 'tag2',
            'label': '标签3'
          },
          {
            'key': 'tag3',
            'label': '标签5'
          },
          {
            'key': 'tag4',
            'label': '标签7'
          },
          {
            'key': 'tag5',
            'label': '标签9'
          },
          {
            'key': 'tag6',
            'label': '标签1'
          },
          {
            'key': 'tag7',
            'label': '标签3'
          },
          {
            'key': 'tag8',
            'label': '标签5'
          },
          {
            'key': 'tag9',
            'label': '标签7'
          },
          {
            'key': 'tag10',
            'label': '标签9'
          }
        ],
        'contentTag': [
          {
            'key': 'ctag1',
            'label': '法规学习'
          },
          {
            'key': 'ctag2',
            'label': '新政策'
          },
          {
            'key': 'ctag3',
            'label': '市局'
          },
          {
            'key': 'ctag4',
            'label': '分局'
          }
        ],
        'examineStatus': [
          {
            'key': 'approved',
            'label': '审批通过'
          },
          {
            'key': 'rejective',
            'label': '审批未通过'
          },
          {
            'key': 'unsolved',
            'label': '已提交'
          }
        ],
        'channelType': [
          {
            'key': 'sms',
            'label': '短信'
          },
          {
            'key': 'app',
            'label': 'app'
          },
          {
            'key': 'business',
            'label': '业务频道'
          },
          {
            'key': 'wx',
            'label': '微信'
          },
          {
            'key': 'openApi',
            'label': 'openApi'
          },
          {
            'key': 'smartCall',
            'label': '智能客服'
          }
        ],
        'templateOrigin': [
          {
            'key': 'default',
            'label': '默认'
          },
          {
            'key': 'custom',
            'label': '自定义'
          }
        ]
      }
    }
    resolve(res)
  })
}

export function channelType(query) {
  return request({
    url: '/common/channel-type',
    method: 'get',
    params: query
  })
}

export function domain(query) {
  return request({
    url: '/common/domain',
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
