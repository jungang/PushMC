import request from '@/utils/request'

export function fetchList(query) {
/*  return request({
    url: '/channel-push/list',
    method: 'get',
    params: query
  })*/

  return new Promise((resolve, reject) => {
    const res = {
      'code': 20000,
      'msg': '',
      'data': {
        'total': 2137,
        'items': [
          {
            'templateKey': 'tmp3',
            'pushPlanOption': 3,
            'rules': [],
            'rule': '间世入规日',
            'receiptSecond': 525,
            'lastPushTime': '2006-02-06 11:11:45',
            'content': '{ 用户姓名 } { 职务 } 您好，{ 业务数据信息 } 如有疑问，请联系 { 发送部门 }',
            'tag': [
              'tag1',
              'tag2'
            ],
            'title': '育号型如适长际流效力高多',
            'id': 7382031,
            'status': 'notPush',
            'origin': '崔强',
            'additionalOption': [
              {
                'priority': 7,
                'rule': '口中标'
              },
              {
                'priority': 2,
                'rule': '行造示'
              }
            ],
            'pushChannels': [
              {
                'type': 'sms',
                'id': 1,
                'label': '短信'
              },
              {
                'type': 'app',
                'id': 2,
                'label': 'app'
              },
              {
                'type': 'business',
                'id': 3,
                'label': 'business'
              },
              {
                'type': 'wx',
                'id': 4,
                'label': '微信'
              },
              {
                'type': 'openApi',
                'id': 5,
                'label': 'openApi'
              },
              {
                'type': 'smartCall',
                'id': 6,
                'label': '智能客服'
              }
            ],
            'receipt': 'false',
            'pushPlan': 'instant',
            'targetes': [
              {
                'createDate': '1981-08-21 21:25:02',
                'amount': 10,
                'status': 'enabled',
                'title': '至派所'
              },
              {
                'createDate': '2018-02-07 12:55:55',
                'amount': 92,
                'status': 'disabled',
                'title': '时周多参叫便'
              }
            ],
            'targetType': 2
          },
          {
            'templateKey': 'tmp4',
            'pushPlanOption': 3,
            'rules': [],
            'rule': '命方江低调',
            'receiptSecond': 610,
            'lastPushTime': '1986-07-24 00:34:52',
            'content': '{ 用户姓名 } { 职务 } 您好，{ 业务数据信息 } 如有疑问，请联系 { 发送部门 }',
            'tag': [
              'tag1',
              'tag2'
            ],
            'title': '铁身亲较活',
            'id': 8721607,
            'status': 'notPush',
            'origin': '傅静',
            'additionalOption': [
              {
                'priority': 3,
                'rule': '却划指国走'
              }
            ],
            'pushChannels': [
              {
                'type': 'sms',
                'id': 7,
                'label': '短信'
              },
              {
                'type': 'app',
                'id': 8,
                'label': 'app'
              },
              {
                'type': 'business',
                'id': 9,
                'label': 'business'
              },
              {
                'type': 'wx',
                'id': 10,
                'label': '微信'
              }
            ],
            'receipt': 'false',
            'pushPlan': 'instant',
            'targetes': [
              {
                'createDate': '1979-02-09 19:32:28',
                'amount': 68,
                'status': 'disabled',
                'title': '前难几断转战王'
              },
              {
                'createDate': '1984-10-06 14:42:21',
                'amount': 93,
                'status': 'disabled',
                'title': '公给反联因'
              },
              {
                'createDate': '1989-07-15 00:07:20',
                'amount': 46,
                'status': 'disabled',
                'title': '图全少建组斗提'
              },
              {
                'createDate': '1973-05-17 18:50:05',
                'amount': 88,
                'status': 'disabled',
                'title': '团打空战即级'
              }
            ],
            'targetType': 2
          },
          {
            'templateKey': 'tmp5',
            'pushPlanOption': 2,
            'rules': [],
            'rule': '行容消员难属种',
            'receiptSecond': 233,
            'lastPushTime': '1984-03-13 15:27:06',
            'content': '{ 用户姓名 } { 职务 } 您好，{ 业务数据信息 } 如有疑问，请联系 { 发送部门 }',
            'tag': [
              'tag1',
              'tag2'
            ],
            'title': '织位品元必研指眼运需教响',
            'id': 9386049,
            'status': 'notPush',
            'origin': '尹涛',
            'additionalOption': [
              {
                'priority': 3,
                'rule': '广命与二月花'
              },
              {
                'priority': 7,
                'rule': '育问办领点矿何'
              }
            ],
            'pushChannels': [],
            'receipt': 'true',
            'pushPlan': 'instant',
            'targetes': [
              {
                'createDate': '2013-02-11 13:17:57',
                'amount': 13,
                'status': 'enabled',
                'title': '酸热什般'
              }
            ],
            'targetType': 1
          },
          {
            'templateKey': 'tmp5',
            'pushPlanOption': 2,
            'rules': [],
            'rule': '别革群程你清象',
            'receiptSecond': 501,
            'lastPushTime': '1987-11-06 07:40:36',
            'content': '{ 用户姓名 } { 职务 } 您好，{ 业务数据信息 } 如有疑问，请联系 { 发送部门 }',
            'tag': [
              'tag1',
              'tag2'
            ],
            'title': '林商般量',
            'id': 5849895,
            'status': 'pushed',
            'origin': '许强',
            'additionalOption': [
              {
                'priority': 2,
                'rule': '九安得体发'
              },
              {
                'priority': 7,
                'rule': '被为流现京'
              },
              {
                'priority': 8,
                'rule': '分气后价选老北'
              }
            ],
            'pushChannels': [
              {
                'type': 'openApi',
                'id': 11,
                'label': 'openApi'
              }
            ],
            'receipt': 'true',
            'pushPlan': 'instant',
            'targetes': [
              {
                'createDate': '1977-08-26 06:07:13',
                'amount': 81,
                'status': 'disabled',
                'title': '利学已问这认离'
              },
              {
                'createDate': '1971-09-01 20:37:03',
                'amount': 72,
                'status': 'disabled',
                'title': '共性看全技交'
              }
            ],
            'targetType': 2
          },
          {
            'templateKey': 'tmp4',
            'pushPlanOption': 5,
            'rules': [],
            'rule': '矿备重了很却',
            'receiptSecond': 437,
            'lastPushTime': '2019-10-08 02:41:45',
            'content': '{ 用户姓名 } { 职务 } 您好，{ 业务数据信息 } 如有疑问，请联系 { 发送部门 }',
            'tag': [
              'tag1',
              'tag2'
            ],
            'title': '家值克史',
            'id': 7626573,
            'status': 'pushed',
            'origin': '何伟',
            'additionalOption': [
              {
                'priority': 10,
                'rule': '处因民格府加做'
              },
              {
                'priority': 8,
                'rule': '八备温领权自到'
              },
              {
                'priority': 8,
                'rule': '运想断边究'
              }
            ],
            'pushChannels': [
              {
                'type': 'smartCall',
                'id': 12,
                'label': '智能客服'
              },
              {
                'type': 'sms',
                'id': 13,
                'label': '短信'
              },
              {
                'type': 'app',
                'id': 14,
                'label': 'app'
              },
              {
                'type': 'business',
                'id': 15,
                'label': 'business'
              },
              {
                'type': 'wx',
                'id': 16,
                'label': '微信'
              }
            ],
            'receipt': 'false',
            'pushPlan': 'instant',
            'targetes': [
              {
                'createDate': '1979-08-10 04:08:58',
                'amount': 43,
                'status': 'disabled',
                'title': '千公及北联加'
              },
              {
                'createDate': '1983-01-03 10:56:54',
                'amount': 16,
                'status': 'disabled',
                'title': '难养之最了院支'
              },
              {
                'createDate': '1979-08-04 18:37:36',
                'amount': 65,
                'status': 'enabled',
                'title': '造确日日'
              },
              {
                'createDate': '1993-10-27 09:57:48',
                'amount': 94,
                'status': 'disabled',
                'title': '少才织'
              },
              {
                'createDate': '1985-01-05 09:16:07',
                'amount': 67,
                'status': 'disabled',
                'title': '精消必商'
              }
            ],
            'targetType': 1
          },
          {
            'templateKey': 'tmp3',
            'pushPlanOption': 2,
            'rules': [],
            'rule': '行口比出农',
            'receiptSecond': 471,
            'lastPushTime': '1993-06-29 09:19:37',
            'content': '{ 用户姓名 } { 职务 } 您好，{ 业务数据信息 } 如有疑问，请联系 { 发送部门 }',
            'tag': [
              'tag1',
              'tag2'
            ],
            'title': '个马北断再作少称局圆运群',
            'id': 4647358,
            'status': 'notPush',
            'origin': '郭娜',
            'additionalOption': [
              {
                'priority': 3,
                'rule': '看族安如号化'
              },
              {
                'priority': 9,
                'rule': '便识低厂间日'
              },
              {
                'priority': 7,
                'rule': '石国造划'
              }
            ],
            'pushChannels': [
              {
                'type': 'openApi',
                'id': 17,
                'label': 'openApi'
              },
              {
                'type': 'smartCall',
                'id': 18,
                'label': '智能客服'
              }
            ],
            'receipt': 'true',
            'pushPlan': 'instant',
            'targetes': [
              {
                'createDate': '1973-01-01 22:05:40',
                'amount': 67,
                'status': 'enabled',
                'title': '七响军地'
              },
              {
                'createDate': '1979-03-25 22:44:22',
                'amount': 53,
                'status': 'disabled',
                'title': '明并空的数各'
              }
            ],
            'targetType': 2
          },
          {
            'templateKey': 'tmp5',
            'pushPlanOption': 2,
            'rules': [],
            'rule': '去名年',
            'receiptSecond': 993,
            'lastPushTime': '1972-04-29 02:48:02',
            'content': '{ 用户姓名 } { 职务 } 您好，{ 业务数据信息 } 如有疑问，请联系 { 发送部门 }',
            'tag': [
              'tag1',
              'tag2'
            ],
            'title': '生此了装周重向集种',
            'id': 7618188,
            'status': 'pushed',
            'origin': '武艳',
            'additionalOption': [
              {
                'priority': 9,
                'rule': '特至产此命油'
              },
              {
                'priority': 1,
                'rule': '外层色先设'
              },
              {
                'priority': 8,
                'rule': '快听接查'
              },
              {
                'priority': 3,
                'rule': '都容为去'
              },
              {
                'priority': 6,
                'rule': '认量每却民'
              }
            ],
            'pushChannels': [
              {
                'type': 'sms',
                'id': 19,
                'label': '短信'
              },
              {
                'type': 'app',
                'id': 20,
                'label': 'app'
              },
              {
                'type': 'business',
                'id': 21,
                'label': 'business'
              },
              {
                'type': 'wx',
                'id': 22,
                'label': '微信'
              },
              {
                'type': 'openApi',
                'id': 23,
                'label': 'openApi'
              }
            ],
            'receipt': 'true',
            'pushPlan': 'instant',
            'targetes': [
              {
                'createDate': '2007-09-09 07:19:50',
                'amount': 15,
                'status': 'enabled',
                'title': '传们海义'
              },
              {
                'createDate': '2001-03-30 06:34:48',
                'amount': 17,
                'status': 'enabled',
                'title': '解信国济立照'
              }
            ],
            'targetType': 2
          },
          {
            'templateKey': 'tmp5',
            'pushPlanOption': 4,
            'rules': [],
            'rule': '整非下表',
            'receiptSecond': 374,
            'lastPushTime': '1984-01-15 14:58:49',
            'content': '{ 用户姓名 } { 职务 } 您好，{ 业务数据信息 } 如有疑问，请联系 { 发送部门 }',
            'tag': [
              'tag1',
              'tag2'
            ],
            'title': '带维族图如',
            'id': 7488007,
            'status': 'pushed',
            'origin': '曹勇',
            'additionalOption': [
              {
                'priority': 9,
                'rule': '马保更列新'
              },
              {
                'priority': 3,
                'rule': '龙六只石例类果'
              }
            ],
            'pushChannels': [
              {
                'type': 'smartCall',
                'id': 24,
                'label': '智能客服'
              }
            ],
            'receipt': 'false',
            'pushPlan': 'instant',
            'targetes': [
              {
                'createDate': '1972-07-08 10:55:21',
                'amount': 4,
                'status': 'disabled',
                'title': '分在办门'
              },
              {
                'createDate': '1985-02-07 11:22:11',
                'amount': 10,
                'status': 'disabled',
                'title': '些里其飞'
              },
              {
                'createDate': '1999-07-19 13:58:34',
                'amount': 29,
                'status': 'enabled',
                'title': '展思得最出'
              }
            ],
            'targetType': 1
          },
          {
            'templateKey': 'tmp3',
            'pushPlanOption': 2,
            'rules': [],
            'rule': '选需精制难',
            'receiptSecond': 993,
            'lastPushTime': '1976-10-07 18:31:44',
            'content': '{ 用户姓名 } { 职务 } 您好，{ 业务数据信息 } 如有疑问，请联系 { 发送部门 }',
            'tag': [
              'tag1',
              'tag2'
            ],
            'title': '且养备论参家',
            'id': 7157617,
            'status': 'notPush',
            'origin': '江勇',
            'additionalOption': [
              {
                'priority': 10,
                'rule': '育场委'
              },
              {
                'priority': 8,
                'rule': '响信会度却很进'
              }
            ],
            'pushChannels': [],
            'receipt': 'false',
            'pushPlan': 'instant',
            'targetes': [
              {
                'createDate': '2007-02-06 13:53:18',
                'amount': 16,
                'status': 'disabled',
                'title': '家认便'
              },
              {
                'createDate': '2007-04-18 17:30:46',
                'amount': 64,
                'status': 'disabled',
                'title': '清规使按度加'
              },
              {
                'createDate': '2001-08-22 17:23:38',
                'amount': 69,
                'status': 'enabled',
                'title': '会想她收加'
              },
              {
                'createDate': '1987-02-06 20:04:47',
                'amount': 9,
                'status': 'disabled',
                'title': '海无周用分之'
              },
              {
                'createDate': '2017-12-04 20:52:06',
                'amount': 72,
                'status': 'enabled',
                'title': '金观把广领'
              }
            ],
            'targetType': 1
          },
          {
            'templateKey': 'tmp2',
            'pushPlanOption': 2,
            'rules': [],
            'rule': '听龙着她构始他',
            'receiptSecond': 810,
            'lastPushTime': '1997-10-15 11:38:31',
            'content': '{ 用户姓名 } { 职务 } 您好，{ 业务数据信息 } 如有疑问，请联系 { 发送部门 }',
            'tag': [
              'tag1',
              'tag2'
            ],
            'title': '位应行并物',
            'id': 3827600,
            'status': 'pushed',
            'origin': '董桂英',
            'additionalOption': [
              {
                'priority': 6,
                'rule': '会制动期'
              }
            ],
            'pushChannels': [
              {
                'type': 'sms',
                'id': 25,
                'label': '短信'
              },
              {
                'type': 'app',
                'id': 26,
                'label': 'app'
              }
            ],
            'receipt': 'false',
            'pushPlan': 'instant',
            'targetes': [
              {
                'createDate': '1974-02-02 05:16:20',
                'amount': 2,
                'status': 'disabled',
                'title': '通之第党'
              },
              {
                'createDate': '2007-03-26 23:54:49',
                'amount': 76,
                'status': 'enabled',
                'title': '会很级取'
              },
              {
                'createDate': '2014-10-11 00:10:45',
                'amount': 99,
                'status': 'enabled',
                'title': '准局当厂军'
              }
            ],
            'targetType': 1
          },
          {
            'templateKey': 'tmp4',
            'pushPlanOption': 4,
            'rules': [],
            'rule': '气白产离就处亲',
            'receiptSecond': 680,
            'lastPushTime': '1983-01-25 04:09:53',
            'content': '{ 用户姓名 } { 职务 } 您好，{ 业务数据信息 } 如有疑问，请联系 { 发送部门 }',
            'tag': [
              'tag1',
              'tag2'
            ],
            'title': '亲容技同更两事育',
            'id': 7500275,
            'status': 'notPush',
            'origin': '常静',
            'additionalOption': [
              {
                'priority': 10,
                'rule': '率前叫型'
              },
              {
                'priority': 9,
                'rule': '些热广外'
              }
            ],
            'pushChannels': [
              {
                'type': 'business',
                'id': 27,
                'label': 'business'
              },
              {
                'type': 'wx',
                'id': 28,
                'label': '微信'
              },
              {
                'type': 'openApi',
                'id': 29,
                'label': 'openApi'
              },
              {
                'type': 'smartCall',
                'id': 30,
                'label': '智能客服'
              },
              {
                'type': 'sms',
                'id': 31,
                'label': '短信'
              }
            ],
            'receipt': 'true',
            'pushPlan': 'instant',
            'targetes': [
              {
                'createDate': '1988-03-24 11:50:20',
                'amount': 94,
                'status': 'enabled',
                'title': '口及照量'
              },
              {
                'createDate': '1986-09-08 02:01:09',
                'amount': 61,
                'status': 'disabled',
                'title': '员联叫便'
              },
              {
                'createDate': '1981-05-16 01:01:39',
                'amount': 27,
                'status': 'disabled',
                'title': '质长别队'
              },
              {
                'createDate': '1998-05-15 11:24:14',
                'amount': 99,
                'status': 'disabled',
                'title': '须力世厂山点'
              },
              {
                'createDate': '2015-11-04 03:19:23',
                'amount': 59,
                'status': 'enabled',
                'title': '装才天队活'
              }
            ],
            'targetType': 1
          },
          {
            'templateKey': 'tmp2',
            'pushPlanOption': 4,
            'rules': [],
            'rule': '相包难种调为八',
            'receiptSecond': 635,
            'lastPushTime': '2003-04-26 02:16:16',
            'content': '{ 用户姓名 } { 职务 } 您好，{ 业务数据信息 } 如有疑问，请联系 { 发送部门 }',
            'tag': [
              'tag1',
              'tag2'
            ],
            'title': '过华指热复技成活证个角',
            'id': 3034886,
            'status': 'notPush',
            'origin': '熊伟',
            'additionalOption': [
              {
                'priority': 7,
                'rule': '这七米'
              },
              {
                'priority': 5,
                'rule': '式毛车府'
              }
            ],
            'pushChannels': [
              {
                'type': 'app',
                'id': 32,
                'label': 'app'
              }
            ],
            'receipt': 'true',
            'pushPlan': 'instant',
            'targetes': [
              {
                'createDate': '1988-05-08 08:33:22',
                'amount': 38,
                'status': 'enabled',
                'title': '查接把回'
              },
              {
                'createDate': '1998-01-15 10:04:45',
                'amount': 72,
                'status': 'disabled',
                'title': '究类包周斗声'
              }
            ],
            'targetType': 1
          },
          {
            'templateKey': 'tmp1',
            'pushPlanOption': 4,
            'rules': [],
            'rule': '风长边成',
            'receiptSecond': 282,
            'lastPushTime': '1999-05-13 08:40:47',
            'content': '{ 用户姓名 } { 职务 } 您好，{ 业务数据信息 } 如有疑问，请联系 { 发送部门 }',
            'tag': [
              'tag1',
              'tag2'
            ],
            'title': '人历律细设下世以长',
            'id': 6385838,
            'status': 'pushed',
            'origin': '沈艳',
            'additionalOption': [
              {
                'priority': 1,
                'rule': '易已效什果等'
              },
              {
                'priority': 7,
                'rule': '人级每此办厂管'
              },
              {
                'priority': 5,
                'rule': '属工本土'
              },
              {
                'priority': 8,
                'rule': '作对效局经多始'
              },
              {
                'priority': 7,
                'rule': '改因准经件'
              }
            ],
            'pushChannels': [
              {
                'type': 'business',
                'id': 33,
                'label': 'business'
              },
              {
                'type': 'wx',
                'id': 34,
                'label': '微信'
              },
              {
                'type': 'openApi',
                'id': 35,
                'label': 'openApi'
              }
            ],
            'receipt': 'false',
            'pushPlan': 'instant',
            'targetes': [
              {
                'createDate': '2006-12-13 12:03:55',
                'amount': 23,
                'status': 'disabled',
                'title': '石类料便包下习'
              },
              {
                'createDate': '1971-03-25 22:31:47',
                'amount': 76,
                'status': 'enabled',
                'title': '速始青'
              },
              {
                'createDate': '2002-12-08 07:22:45',
                'amount': 70,
                'status': 'disabled',
                'title': '它作身走手'
              },
              {
                'createDate': '2017-11-19 17:50:38',
                'amount': 71,
                'status': 'disabled',
                'title': '生命么比'
              }
            ],
            'targetType': 2
          },
          {
            'templateKey': 'tmp4',
            'pushPlanOption': 5,
            'rules': [],
            'rule': '候只去产',
            'receiptSecond': 14,
            'lastPushTime': '2014-06-14 15:03:25',
            'content': '{ 用户姓名 } { 职务 } 您好，{ 业务数据信息 } 如有疑问，请联系 { 发送部门 }',
            'tag': [
              'tag1',
              'tag2'
            ],
            'title': '质入全省',
            'id': 4575851,
            'status': 'notPush',
            'origin': '彭涛',
            'additionalOption': [
              {
                'priority': 9,
                'rule': '应土加线'
              },
              {
                'priority': 1,
                'rule': '风青军需着'
              },
              {
                'priority': 1,
                'rule': '进计广产些经'
              }
            ],
            'pushChannels': [
              {
                'type': 'smartCall',
                'id': 36,
                'label': '智能客服'
              },
              {
                'type': 'sms',
                'id': 37,
                'label': '短信'
              },
              {
                'type': 'app',
                'id': 38,
                'label': 'app'
              }
            ],
            'receipt': 'true',
            'pushPlan': 'instant',
            'targetes': [
              {
                'createDate': '1975-02-21 10:00:26',
                'amount': 85,
                'status': 'enabled',
                'title': '见看二器说'
              },
              {
                'createDate': '1994-08-01 20:30:42',
                'amount': 26,
                'status': 'disabled',
                'title': '节每究'
              },
              {
                'createDate': '1992-01-26 17:50:18',
                'amount': 44,
                'status': 'disabled',
                'title': '空心于'
              },
              {
                'createDate': '2011-06-13 00:52:04',
                'amount': 57,
                'status': 'enabled',
                'title': '场书工花'
              }
            ],
            'targetType': 1
          },
          {
            'templateKey': 'tmp5',
            'pushPlanOption': 3,
            'rules': [],
            'rule': '造效与律亲特时',
            'receiptSecond': 105,
            'lastPushTime': '1995-03-23 00:27:59',
            'content': '{ 用户姓名 } { 职务 } 您好，{ 业务数据信息 } 如有疑问，请联系 { 发送部门 }',
            'tag': [
              'tag1',
              'tag2'
            ],
            'title': '一酸制知步平热',
            'id': 7833680,
            'status': 'notPush',
            'origin': '康超',
            'additionalOption': [
              {
                'priority': 4,
                'rule': '层平同拉她'
              },
              {
                'priority': 8,
                'rule': '要对共相调'
              },
              {
                'priority': 8,
                'rule': '达包委到角'
              },
              {
                'priority': 6,
                'rule': '红色并价天'
              }
            ],
            'pushChannels': [
              {
                'type': 'business',
                'id': 39,
                'label': 'business'
              },
              {
                'type': 'wx',
                'id': 40,
                'label': '微信'
              }
            ],
            'receipt': 'true',
            'pushPlan': 'instant',
            'targetes': [
              {
                'createDate': '1985-09-19 04:31:19',
                'amount': 56,
                'status': 'enabled',
                'title': '队万的商放史'
              }
            ],
            'targetType': 1
          },
          {
            'templateKey': 'tmp4',
            'pushPlanOption': 5,
            'rules': [],
            'rule': '从工建府',
            'receiptSecond': 712,
            'lastPushTime': '2014-09-05 15:35:30',
            'content': '{ 用户姓名 } { 职务 } 您好，{ 业务数据信息 } 如有疑问，请联系 { 发送部门 }',
            'tag': [
              'tag1',
              'tag2'
            ],
            'title': '确三连离清前较型工放新',
            'id': 4650595,
            'status': 'pushed',
            'origin': '马静',
            'additionalOption': [
              {
                'priority': 7,
                'rule': '其这之'
              },
              {
                'priority': 7,
                'rule': '性便号部先政后'
              },
              {
                'priority': 3,
                'rule': '有门战同图'
              },
              {
                'priority': 5,
                'rule': '已认基被'
              }
            ],
            'pushChannels': [
              {
                'type': 'openApi',
                'id': 41,
                'label': 'openApi'
              },
              {
                'type': 'smartCall',
                'id': 42,
                'label': '智能客服'
              },
              {
                'type': 'sms',
                'id': 43,
                'label': '短信'
              },
              {
                'type': 'app',
                'id': 44,
                'label': 'app'
              },
              {
                'type': 'business',
                'id': 45,
                'label': 'business'
              }
            ],
            'receipt': 'false',
            'pushPlan': 'instant',
            'targetes': [
              {
                'createDate': '1972-07-17 15:28:24',
                'amount': 10,
                'status': 'disabled',
                'title': '声之关产水律'
              },
              {
                'createDate': '1983-06-22 07:01:39',
                'amount': 9,
                'status': 'enabled',
                'title': '清真通适青构机'
              },
              {
                'createDate': '2010-06-26 07:33:58',
                'amount': 96,
                'status': 'disabled',
                'title': '大技基'
              }
            ],
            'targetType': 2
          },
          {
            'templateKey': 'tmp2',
            'pushPlanOption': 4,
            'rules': [],
            'rule': '们内称元',
            'receiptSecond': 366,
            'lastPushTime': '1978-01-30 22:47:08',
            'content': '{ 用户姓名 } { 职务 } 您好，{ 业务数据信息 } 如有疑问，请联系 { 发送部门 }',
            'tag': [
              'tag1',
              'tag2'
            ],
            'title': '量最设断集交',
            'id': 5493967,
            'status': 'pushed',
            'origin': '高霞',
            'additionalOption': [
              {
                'priority': 10,
                'rule': '期参子切东'
              },
              {
                'priority': 3,
                'rule': '对做红周地一'
              }
            ],
            'pushChannels': [
              {
                'type': 'wx',
                'id': 46,
                'label': '微信'
              },
              {
                'type': 'openApi',
                'id': 47,
                'label': 'openApi'
              },
              {
                'type': 'smartCall',
                'id': 48,
                'label': '智能客服'
              },
              {
                'type': 'sms',
                'id': 49,
                'label': '短信'
              }
            ],
            'receipt': 'false',
            'pushPlan': 'instant',
            'targetes': [
              {
                'createDate': '2000-12-15 01:02:43',
                'amount': 21,
                'status': 'disabled',
                'title': '技提物效有'
              },
              {
                'createDate': '1995-10-18 13:56:10',
                'amount': 95,
                'status': 'enabled',
                'title': '安本事准'
              },
              {
                'createDate': '2012-12-07 22:12:38',
                'amount': 54,
                'status': 'disabled',
                'title': '五音头中始'
              },
              {
                'createDate': '2014-04-06 10:02:54',
                'amount': 98,
                'status': 'enabled',
                'title': '实究具率眼'
              },
              {
                'createDate': '1976-11-07 04:26:29',
                'amount': 94,
                'status': 'disabled',
                'title': '片好复住'
              }
            ],
            'targetType': 2
          },
          {
            'templateKey': 'tmp5',
            'pushPlanOption': 5,
            'rules': [],
            'rule': '统便王',
            'receiptSecond': 324,
            'lastPushTime': '1988-11-19 16:56:41',
            'content': '{ 用户姓名 } { 职务 } 您好，{ 业务数据信息 } 如有疑问，请联系 { 发送部门 }',
            'tag': [
              'tag1',
              'tag2'
            ],
            'title': '设计论子也制马商建天法它',
            'id': 9701408,
            'status': 'pushed',
            'origin': '姚艳',
            'additionalOption': [
              {
                'priority': 2,
                'rule': '解生声而变'
              },
              {
                'priority': 3,
                'rule': '么上区信'
              }
            ],
            'pushChannels': [
              {
                'type': 'app',
                'id': 50,
                'label': 'app'
              },
              {
                'type': 'business',
                'id': 51,
                'label': 'business'
              },
              {
                'type': 'wx',
                'id': 52,
                'label': '微信'
              },
              {
                'type': 'openApi',
                'id': 53,
                'label': 'openApi'
              },
              {
                'type': 'smartCall',
                'id': 54,
                'label': '智能客服'
              }
            ],
            'receipt': 'true',
            'pushPlan': 'instant',
            'targetes': [
              {
                'createDate': '2003-06-01 05:12:36',
                'amount': 62,
                'status': 'enabled',
                'title': '我省书月'
              },
              {
                'createDate': '2006-05-16 10:30:24',
                'amount': 98,
                'status': 'disabled',
                'title': '路示接该'
              }
            ],
            'targetType': 2
          },
          {
            'templateKey': 'tmp2',
            'pushPlanOption': 5,
            'rules': [],
            'rule': '团光住想如连',
            'receiptSecond': 409,
            'lastPushTime': '2011-11-16 12:34:39',
            'content': '{ 用户姓名 } { 职务 } 您好，{ 业务数据信息 } 如有疑问，请联系 { 发送部门 }',
            'tag': [
              'tag1',
              'tag2'
            ],
            'title': '元完儿马路进',
            'id': 7498774,
            'status': 'notPush',
            'origin': '邱桂英',
            'additionalOption': [
              {
                'priority': 4,
                'rule': '住京按'
              }
            ],
            'pushChannels': [
              {
                'type': 'sms',
                'id': 55,
                'label': '短信'
              },
              {
                'type': 'app',
                'id': 56,
                'label': 'app'
              },
              {
                'type': 'business',
                'id': 57,
                'label': 'business'
              },
              {
                'type': 'wx',
                'id': 58,
                'label': '微信'
              },
              {
                'type': 'openApi',
                'id': 59,
                'label': 'openApi'
              },
              {
                'type': 'smartCall',
                'id': 60,
                'label': '智能客服'
              }
            ],
            'receipt': 'true',
            'pushPlan': 'instant',
            'targetes': [
              {
                'createDate': '2016-08-07 06:58:37',
                'amount': 93,
                'status': 'disabled',
                'title': '点观先军公公研'
              },
              {
                'createDate': '1973-10-22 16:15:25',
                'amount': 15,
                'status': 'disabled',
                'title': '场国发并还月'
              },
              {
                'createDate': '1987-10-08 07:39:10',
                'amount': 2,
                'status': 'disabled',
                'title': '县持取'
              }
            ],
            'targetType': 1
          },
          {
            'templateKey': 'tmp4',
            'pushPlanOption': 4,
            'rules': [],
            'rule': '主引前展了到',
            'receiptSecond': 233,
            'lastPushTime': '2017-07-12 10:23:27',
            'content': '{ 用户姓名 } { 职务 } 您好，{ 业务数据信息 } 如有疑问，请联系 { 发送部门 }',
            'tag': [
              'tag1',
              'tag2'
            ],
            'title': '却需儿品件龙温区式结二京',
            'id': 5173115,
            'status': 'notPush',
            'origin': '夏丽',
            'additionalOption': [
              {
                'priority': 7,
                'rule': '空现管米'
              },
              {
                'priority': 3,
                'rule': '观历和济示'
              }
            ],
            'pushChannels': [
              {
                'type': 'sms',
                'id': 61,
                'label': '短信'
              },
              {
                'type': 'app',
                'id': 62,
                'label': 'app'
              },
              {
                'type': 'business',
                'id': 63,
                'label': 'business'
              },
              {
                'type': 'wx',
                'id': 64,
                'label': '微信'
              },
              {
                'type': 'openApi',
                'id': 65,
                'label': 'openApi'
              }
            ],
            'receipt': 'false',
            'pushPlan': 'instant',
            'targetes': [
              {
                'createDate': '1970-03-27 12:39:58',
                'amount': 73,
                'status': 'enabled',
                'title': '光上素明'
              },
              {
                'createDate': '2006-01-03 11:14:28',
                'amount': 19,
                'status': 'enabled',
                'title': '派我个世'
              }
            ],
            'targetType': 1
          }
        ]
      }
    }
    resolve(res)
  })
}
export function detail(query) {
  return request({
    url: '/channel-push/detail',
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
    url: '/push-target/groups',
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

export function changeStatus(id, status) {
  return request({
    url: '/channel-push/status',
    method: 'put',
    params: { id, status }
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
    params: { word: keyWord }
  })
}

export function dele(id, status) {
  return request({
    url: '/channel-push/delete',
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
    url: '/channel-push/create',
    method: 'post',
    data: data
  })
}

export function updateChannel(data) {
  return request({
    url: '/channel-push/update',
    method: 'put',
    data: data
  })
}
export function copyChannel(data) {
  return request({
    url: '/channel-push/copy',
    method: 'post',
    data: data
  })
}

export function push(data) {
  return request({
    url: '/channel-push/push',
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
