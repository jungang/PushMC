/**
 * @return {null}
 */
document.documentElement.style.fontSize = document.documentElement.clientWidth / 32 + 'px'

function GetQueryString(name) {
  var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
  var r = window.location.search.substr(1).match(reg)
  return (r != null) ? unescape(r[2]) : null
}

const url = 'http://39.98.167.246:9910/smartpush/rest/message/detail' // 代理
const id = GetQueryString('id')
const data = {}

$.ajax({
  type: 'GET',
  url: url,
  data: { id: id },
  dataType: 'json',
  timeout: 3000,
  success: function(res) {
    console.log('res', res.data)
    data.sendData = JSON.parse(res.data.sendData)
    data.config = JSON.parse(res.data.config)
    data.acceptData = JSON.parse(res.data.acceptData)
    render()
  },
  error: function(xhr, type) {
    console.log(xhr)
  }
})

function render() {
  console.log(data.acceptData)
  $('#title').text(data.acceptData.title)
  $('#cover').attr('src', data.acceptData.cover)
  $('#category span').text(data.acceptData.category)
  $('#tag span').text(data.acceptData.tag)
  $('#updateTime').text(data.acceptData.updateTime)
  $('#content').html(data.acceptData.content)
}

