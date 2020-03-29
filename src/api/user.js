import request from '@/utils/request'
export function xxx(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}
export function login(data) {
/*  return request({
    url: '/user/login',
    method: 'post',
    data
  })*/

  return new Promise((resolve, reject) => {
    const res = {
      'code': 20000,
      'data': {
        'token': 1
      },
      'msg': 'Login successfully'
    }
    resolve(res)
  })
}

export function getUserInfo(token) {
/*  return request({
    url: '/user/login',
    method: 'get',
    params: { app_token: token }
  })*/

  return new Promise((resolve, reject) => {
    const res = {
      'code': 20000,
      'msg': null,
      'data': {
        'id': 1,
        'updateTime': null,
        'userid': 'xiaoning@xykj',
        'name': '史小宁',
        'phone': '',
        'avatar': null,
        'maindeptid': 3,
        'departname': '开发部',
        'duty': 'Java 工程师',
        'email': 'admin@xykj',
        'ext': null,
        'sysError': {
          channel: true,
          push_channel: false,
          target: false
        },
        'roles': [{
          'id': 1,
          'updateTime': null,
          'title': '超级管理员2222',
          'describe': '超级管理员1111',
          'smPermissions': [
            {
              'id': 11,
              'title': '数据源',
              'type': 'menu'
            },
            {
              'id': 12,
              'title': '标签分类',
              'type': 'menu'
            },
            {
              'id': 13,
              'title': '标注',
              'type': 'menu'
            },
            {
              'id': 14,
              'title': '推送频道',
              'type': 'menu'
            },
            {
              'id': 15,
              'title': '推送通道',
              'type': 'menu'
            },
            {
              'id': 16,
              'title': '推送对象',
              'type': 'menu'
            },
            {
              'id': 17,
              'title': '消息推送',
              'type': 'menu'
            },
            {
              'id': 21,
              'title': '推送内容',
              'type': 'menu'
            },
            {
              'id': 22,
              'title': '内容审批',
              'type': 'menu'
            },
            {
              'id': 31,
              'title': '用户权限',
              'type': 'menu'
            },
            {
              'id': 32,
              'title': '推送统计',
              'type': 'menu'
            },
            {
              'id': 101,
              'title': '新建数据源',
              'type': 'act'
            }
          ],
          /*          'smPermissions': [
            {
              'id': 1,
              'updateTime': null,
              'title': '业务频道',
              'path': '/business-channel',
              'describe': '业务频道'
            }, {
              'id': 2,
              'updateTime': null,
              'title': '消息推送',
              'path': '/message-push',
              'describe': '消息推送'
            }, {
              'id': 3,
              'updateTime': null,
              'title': '数据标注',
              'path': '/data-tag',
              'describe': '数据标注'
            }, {
              'id': 4,
              'updateTime': null,
              'title': '推送统计',
              'path': '/statistics',
              'describe': '推送统计'
            }, {
              'id': 5,
              'updateTime': null,
              'title': '用户权限',
              'path': '/user',
              'describe': '用户权限'
            }, {
              'id': 6,
              'updateTime': null,
              'title': 'GoCom组织',
              'path': '/common',
              'describe': 'GoCom组织'
            }, {
              'id': 7,
              'updateTime': null,
              'title': '推送审核',
              'path': '/examine',
              'describe': '推送审核'
            }, {
              'id': 8,
              'updateTime': null,
              'title': '数据标注2',
              'path': '/resource',
              'describe': '数据标注2'
            }, {
              'id': 9,
              'updateTime': null,
              'title': '推送通道',
              'path': '/push-channel',
              'describe': '推送通道'
            }, {
              'id': 10,
              'updateTime': null,
              'title': '新建业务频道',
              'path': '/business-channel/create',
              'describe': '新建业务频道'
            }, {
              'id': 11,
              'updateTime': null,
              'title': '首页',
              'path': '/home',
              'describe': '首页'
            }, {
              'id': 12,
              'updateTime': null,
              'title': '消息模版',
              'path': '/message-template',
              'describe': '消息模版'
            }, {
              'id': 13,
              'updateTime': null,
              'title': '创建标签',
              'path': '/label',
              'describe': '创建标签'
            }, {
              'id': 14,
              'updateTime': null,
              'title': '推送对象',
              'path': '/push-target',
              'describe': '推送对象'
            }, {
              'id': 15,
              'updateTime': null,
              'title': '创建分类',
              'path': '/category',
              'describe': '创建分类'
            }, {
              'id': 16,
              'updateTime': null,
              'title': '渠道推送',
              'path': '/pipe-push',
              'describe': '渠道推送'
            }, {
              'id': 17,
              'updateTime': null,
              'title': '新建推送通道',
              'path': '/push-channel/create',
              'describe': '新建推送通道'
            }, {
              'id': 18,
              'updateTime': null,
              'title': '数据源',
              'path': '/source',
              'describe': '数据源'
            }, {
              'id': 19,
              'updateTime': null,
              'title': '推送内容',
              'path': '/push-content',
              'describe': '推送内容'
            }, {
              'id': 20,
              'updateTime': null,
              'title': '频道推送',
              'path': '/channel-push',
              'describe': '频道推送'
            }],*/
          'persons': null
        }],
        'sessionId': '1'
      }
    }
    resolve(res)
  })
}
export function getPermission(roles) {
/*
  return request({
    url: '/user/permission',
    method: 'get',
    params: { roles }
  })
*/

  return new Promise((resolve, reject) => {
    const res = {
      'code': 20000,
      'data': {
        'roleTypes': [
          {
            'id': '07',
            'path': '/push-target'
          },
          {
            'id': '08',
            'path': '/message-template'
          },
          {
            'id': '09',
            'path': '/message-push'
          }
        ]
      }
    }
    resolve(res)
  })
}

export function logout() {
/*  return request({
    url: '/user/logout',
    method: 'post'
  })*/

  return new Promise((resolve, reject) => {
    const res = {
      'code': 20000
    }
    resolve(res)
  })
}
