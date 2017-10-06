const { API_USER_LOGIN, API_USER_REGISTER } = require('./constants')

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
          appid: appId
        },
        showLoading: false,
        success: json => {
          wx.hideLoading()
          const { skey, uid } = json.data
          setStorage({ skey, uid }, success)
        },
        noLogin: json => {
          if (json.errno == 3520 && json.data && json.data.openid) {
            // 未绑定用户，拿不到unionid
            loginWithUnionid(success, fail, json.data.openid)
          } else {
            wx.hideLoading()
            fail('接口异常')
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

module.exports = {
  login
}