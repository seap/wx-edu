const { API_USER_LOGIN, API_USER_REGISTER, APP_ID } = require('./constants')
const request = require('./request')

function login(success = () => {}, fail = () => {}) {
  wx.showLoading({ title: '登录中' })
  wx.login({
    success: res => {
      if (!res.code) {
        wx.hideLoading()
        fail('获取微信登录失败')
        return
      }
      // 发起登录请求
      request({
        url: API_USER_LOGIN,
        data: {
          code: res.code,
          appid: APP_ID
        },
        showLoading: false,
        success: json => {
          wx.hideLoading()
          const { openid } = json.data
          console.log('openid: ', openid)
          if (openid) {
            wx.setStorage({
              key: 'token',
              data: openid,
              success: () => {
                success(openid)
              }
            })
          } else {
            fail('微信登录失败')
          }
        },
        fail: () => {
          wx.hideLoading()
          fail('网络异常')
        }
      })
    },
    fail: () => {
      wx.hideLoading()
      fail('微信登录失败')
    }
  })
}

function checkLogin(success, fail) {
  try {
    const token = wx.getStorageSync('token')
    if (!token) {
      login(success, fail)
    } else {
      success(token)
    }
  } catch (e) {
    fail(e)
  }
}

module.exports = {
  login,
  checkLogin
}