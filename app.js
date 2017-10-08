const player = require('./common/player')
const { API_CLASS } = require('./common/constants')
const request = require('./common/request')
const { checkLogin } = require('./common/passport')

App({
  onLaunch: function () {
    // 判断登录
    checkLogin(token => {
      this.globalData.token = token
      this.fetchClassList()
    }, err => {
      console.log('check login failed, ', err)
    })

    wx.getUserInfo({
      success: res => {
        // 可以将 res 发送给后台解码出 unionId
        this.globalData.userInfo = res.userInfo
        // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
        // 所以此处加入 callback 以防止这种情况
        if (this.userInfoReadyCallback) {
          this.userInfoReadyCallback(res)
        }
      }
    })
  },

  // 获取班级列表
  fetchClassList: function() {
    request({
      url: API_CLASS,
      success: json => {
        this.globalData.classList = json.data //.sort((a, b) => a.clazz_id > b.clazz_id)
        if (this.classListCallback) {
          this.classListCallback(json.data)
        }
      }
    })
  },

  globalData: {
    userInfo: null,
    classList: null
  },
  player
})