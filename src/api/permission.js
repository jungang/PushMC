import request from '@/utils/request'

export function fetchList(query) {
/*
  return request({
    url: '/permission/list',
    method: 'get',
    params: query
  })
*/

  return new Promise((resolve, reject) => {
    const res = {
      'code': 20000,
      'msg': '',
      'data': {
        'total': 6490,
        'items': [
          {
            'title': '解三次但形包查成以',
            'id': 2202433,
            'member': 53,
            'permissions': [
              '0902',
              '04'
            ],
            'persons': [
              {
                'id': 298446,
                'name': '彭刚'
              },
              {
                'id': 295142,
                'name': '谢艳'
              },
              {
                'id': 187546,
                'name': '袁桂英'
              }
            ]
          },
          {
            'title': '热正法听数',
            'id': 4504952,
            'member': 24,
            'permissions': [
              '09',
              '0901'
            ],
            'persons': [
              {
                'id': 949928,
                'name': '石娜'
              },
              {
                'id': 713171,
                'name': '罗明'
              },
              {
                'id': 401612,
                'name': '易娟'
              },
              {
                'id': 876806,
                'name': '卢娜'
              },
              {
                'id': 306617,
                'name': '何平'
              },
              {
                'id': 694080,
                'name': '曾强'
              },
              {
                'id': 155384,
                'name': '宋明'
              },
              {
                'id': 417792,
                'name': '万杰'
              },
              {
                'id': 777122,
                'name': '汪霞'
              }
            ]
          },
          {
            'title': '界眼支元专府满个',
            'id': 7629920,
            'member': 17,
            'permissions': [
              '0902',
              '04'
            ],
            'persons': [
              {
                'id': 912961,
                'name': '沈涛'
              },
              {
                'id': 846773,
                'name': '唐静'
              },
              {
                'id': 598099,
                'name': '白霞'
              },
              {
                'id': 443575,
                'name': '段敏'
              },
              {
                'id': 755535,
                'name': '丁静'
              },
              {
                'id': 685556,
                'name': '乔娜'
              },
              {
                'id': 743204,
                'name': '张秀兰'
              },
              {
                'id': 523090,
                'name': '乔杰'
              },
              {
                'id': 641398,
                'name': '尹洋'
              },
              {
                'id': 357854,
                'name': '李娜'
              },
              {
                'id': 312924,
                'name': '雷秀兰'
              },
              {
                'id': 156818,
                'name': '郭霞'
              },
              {
                'id': 528300,
                'name': '朱强'
              },
              {
                'id': 686841,
                'name': '毛敏'
              },
              {
                'id': 695772,
                'name': '夏秀兰'
              }
            ]
          },
          {
            'title': '济作油',
            'id': 1245242,
            'member': 9,
            'permissions': [
              '0902',
              '04'
            ],
            'persons': [
              {
                'id': 646593,
                'name': '郭超'
              },
              {
                'id': 373611,
                'name': '邱明'
              },
              {
                'id': 259848,
                'name': '郝磊'
              },
              {
                'id': 916840,
                'name': '董明'
              },
              {
                'id': 538785,
                'name': '彭洋'
              },
              {
                'id': 174468,
                'name': '龚军'
              },
              {
                'id': 717042,
                'name': '许秀英'
              }
            ]
          },
          {
            'title': '水较这给管',
            'id': 2035100,
            'member': 41,
            'permissions': [
              '0902',
              '04'
            ],
            'persons': [
              {
                'id': 729895,
                'name': '叶秀英'
              },
              {
                'id': 894232,
                'name': '程芳'
              },
              {
                'id': 452490,
                'name': '龙平'
              },
              {
                'id': 632251,
                'name': '于洋'
              },
              {
                'id': 464468,
                'name': '孟丽'
              },
              {
                'id': 692008,
                'name': '彭桂英'
              },
              {
                'id': 636106,
                'name': '武秀兰'
              },
              {
                'id': 316480,
                'name': '丁超'
              },
              {
                'id': 998663,
                'name': '文敏'
              },
              {
                'id': 935195,
                'name': '康磊'
              },
              {
                'id': 795679,
                'name': '蔡杰'
              },
              {
                'id': 894570,
                'name': '毛秀兰'
              },
              {
                'id': 317887,
                'name': '陆敏'
              },
              {
                'id': 276137,
                'name': '田洋'
              }
            ]
          },
          {
            'title': '见八得土',
            'id': 4455282,
            'member': 13,
            'permissions': [
              '0902',
              '04'
            ],
            'persons': [
              {
                'id': 267138,
                'name': '高刚'
              },
              {
                'id': 172597,
                'name': '侯平'
              },
              {
                'id': 436008,
                'name': '唐娟'
              },
              {
                'id': 438551,
                'name': '蔡静'
              },
              {
                'id': 444679,
                'name': '侯霞'
              }
            ]
          },
          {
            'title': '知史外所干响们相需',
            'id': 2943367,
            'member': 79,
            'permissions': [
              '0902',
              '04'
            ],
            'persons': [
              {
                'id': 277813,
                'name': '李秀英'
              },
              {
                'id': 264290,
                'name': '萧秀英'
              },
              {
                'id': 751243,
                'name': '萧平'
              },
              {
                'id': 557296,
                'name': '邹芳'
              },
              {
                'id': 288273,
                'name': '谢静'
              },
              {
                'id': 329997,
                'name': '朱杰'
              },
              {
                'id': 115488,
                'name': '戴涛'
              },
              {
                'id': 368405,
                'name': '刘超'
              },
              {
                'id': 728123,
                'name': '陆磊'
              },
              {
                'id': 725986,
                'name': '曹杰'
              },
              {
                'id': 481128,
                'name': '易明'
              },
              {
                'id': 736972,
                'name': '高超'
              },
              {
                'id': 356553,
                'name': '锺磊'
              },
              {
                'id': 402888,
                'name': '马平'
              },
              {
                'id': 669710,
                'name': '冯平'
              }
            ]
          },
          {
            'title': '许本门当实易',
            'id': 2524971,
            'member': 61,
            'permissions': [
              '09',
              '0901'
            ],
            'persons': [
              {
                'id': 128017,
                'name': '梁芳'
              }
            ]
          },
          {
            'title': '油省民影外写金',
            'id': 8673650,
            'member': 33,
            'permissions': [
              '09',
              '0901'
            ],
            'persons': [
              {
                'id': 778572,
                'name': '邹娜'
              },
              {
                'id': 755207,
                'name': '任刚'
              },
              {
                'id': 219567,
                'name': '谭秀兰'
              },
              {
                'id': 189804,
                'name': '曹娟'
              },
              {
                'id': 767617,
                'name': '程秀英'
              },
              {
                'id': 763642,
                'name': '邱丽'
              },
              {
                'id': 703202,
                'name': '邓洋'
              },
              {
                'id': 431382,
                'name': '乔伟'
              },
              {
                'id': 756230,
                'name': '胡芳'
              },
              {
                'id': 507246,
                'name': '赵平'
              },
              {
                'id': 459167,
                'name': '林娜'
              },
              {
                'id': 415455,
                'name': '林军'
              },
              {
                'id': 373661,
                'name': '金娟'
              },
              {
                'id': 686390,
                'name': '石娟'
              }
            ]
          },
          {
            'title': '管北打接且到斗商老',
            'id': 2743759,
            'member': 50,
            'permissions': [
              '09',
              '0901'
            ],
            'persons': [
              {
                'id': 750585,
                'name': '阎勇'
              },
              {
                'id': 248379,
                'name': '梁敏'
              },
              {
                'id': 322276,
                'name': '杨杰'
              },
              {
                'id': 255807,
                'name': '范艳'
              },
              {
                'id': 122184,
                'name': '常伟'
              },
              {
                'id': 800191,
                'name': '薛涛'
              },
              {
                'id': 963124,
                'name': '徐勇'
              },
              {
                'id': 439262,
                'name': '于娜'
              },
              {
                'id': 632414,
                'name': '沈芳'
              },
              {
                'id': 596150,
                'name': '蔡娜'
              },
              {
                'id': 788906,
                'name': '郑刚'
              },
              {
                'id': 889381,
                'name': '姜涛'
              }
            ]
          }
        ]
      }
    }
    resolve(res)
  })
}

export function dele(id, status) {
  return request({
    url: '/permission/delete',
    method: 'delete',
    params: { id, status }
  })
}

export function create(data) {
  return request({
    url: '/permission/create',
    method: 'post',
    data: data
  })
}

export function update(data) {
  return request({
    url: '/permission/update',
    method: 'put',
    data: data
  })
}

export function allPermission(data) {
  return request({
    url: '/permission/all',
    method: 'get',
    data: data
  })
}
