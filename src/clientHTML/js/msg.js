/**
 * @return {null}
 */
document.documentElement.style.fontSize = document.documentElement.clientWidth / 32 + 'px'

function GetQueryString(name) {
  var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
  var r = window.location.search.substr(1).match(reg)
  return (r != null) ? unescape(r[2]) : null
}

const detailUrl = 'http://39.98.167.246:9910/smartpush/rest/message/detail' // 代理
const affirmUrl = 'http://39.98.167.246:9910/smartpush/rest/message/affirm' // 代理
const loginUrl = 'http://39.98.167.246:9910/smartpush/rest/user/login' // 代理
const id = GetQueryString('id') || 1
const app_token = GetQueryString('app_token') || null
let data = {}
let config = {}
let uuid = ''
let userId = ''

// eslint-disable-next-line no-undef
Zepto(function($) {
  $.get(`${loginUrl}?app_token=${app_token}`, function(data, status, xhr) {
    console.log(data.data.userId)
    userId = data.data.userId
  })
  // app_token

  $.ajax({
    type: 'GET',
    url: detailUrl,
    data: { id: id },
    dataType: 'json',
    timeout: 3000,
    success: function(res) {
      data = JSON.parse(res.data.sendData)
      config = JSON.parse(res.data.config)
      uuid = res.data.uuid

      console.log({ data, config, uuid })
      render()
    },
    error: function(xhr, type) {
      console.log(xhr)
    }
  })

  function render() {
    // 更新dom
    $('#title').text(data.SendTitle)
    document.title = data.SendTitle
    $('#cover').attr('src', data.SendCover)
    $('#category span').text(data.category)
    $('#tag span').text(data.tag)
    $('#updateTime').text(data.updateTime)
    $('#content').html(data.SendContent)

    // todo
    // config.receipt = 'false'
    config.receipt = 'true'
    config.pushPlanOption = 1
    config.receiptSecond = 10

    // config.pushPlanOption = 1 按钮确认、 2 阅读读秒计时、 3 不需要确认

    if (config.pushPlanOption === 3) {
      $('.btn').remove()
      $('.timer').remove()
      return
    }

    console.log(config.receipt)
    console.log('continue')
    // pushPlanOption =2 处理倒计时确认
    if (config.pushPlanOption === 2) {
      console.log('config.pushPlanOption:', config.pushPlanOption)
      $('.btn').remove()
      countDown(config.receiptSecond)
    } else {
      $('.timer').remove()
    }

    console.log('config.pushPlanOption:', config.pushPlanOption)
    // pushPlanOption =1 处理按钮确认
    $('.btn').click(function() {
      console.log('config.receipt:', config.receipt)
      console.log(typeof config.receipt)
      console.log(config.receipt === 'true')
      if (config.receipt === 'true') {
        console.log('ajax...')
        $.get(`${affirmUrl}?uuid=${uuid}&userId=${userId}&messageAffirm=1`, function(data, status, xhr) {
          console.log(data)
        })
      }
      $('.btn').remove()
    })
  }
})

function countDown(seconds) {
  if (seconds > 1) {
    console.log('seconds:', seconds)
    seconds--
    $('.timer').text(seconds)
    setTimeout(function() {
      countDown(seconds)
    }, 1000)
  } else {
    $('.timer').remove()

    if (config.receipt === 'true') {
      $.get(`${affirmUrl}?uuid=${uuid}&userId=${userId}&messageAffirm=2`, function(data, status, xhr) {
        console.log(data)
      })
    }
  }
}

