function formatDate(date, format) {
  var o = {
    'M+': date.getMonth() + 1, // month
    'd+': date.getDate(), // day
    'h+': date.getHours(), // hour
    'm+': date.getMinutes(), // minute
    's+': date.getSeconds(), // second
    'q+': Math.floor((date.getMonth() + 3) / 3), // quarter
    'S': date.getMilliseconds() // millisecond
  }

  if (/(y+)/.test(format)) {
    format = format.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }

  for (var k in o) {
    if (new RegExp('(' + k + ')').test(format)) {
      format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length))
    }
  }
  return format
}

function parseSecond(second) {
  let min = 0, sec = parseInt(second)
  if (sec >= 60) {
    min = parseInt(sec / 60)
    sec = sec % 60
  }
  const minFill = min > 9 ? '' : '0'
  const secFill = sec > 9 ? '' : '0'
  return minFill + min + ':' + secFill + sec
}

function askForEnrollment() {
  wx.showModal({
    title: '提示',
    content: '当前没有班级，进入班级报名?',
    success: function(res) {
      if (res.confirm) {
        wx.redirectTo({
          url: '/pages/enrollment/index'
        })
      }
    }
  })
}

module.exports = {
  formatDate,
  parseSecond,
  askForEnrollment
}
