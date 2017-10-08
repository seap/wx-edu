const request = require('../../common/request')
const { API_MEMBER_INFO } = require('../../common/constants')

const app = getApp()

Page({
  data: {
    userInfo: null,
    member: null
  },

  onLoad: function (options) {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo
      })
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo
          })
        }
      })
    }
    request({
      url: API_MEMBER_INFO,
      success: json => {
        this.setData({
          member: json.data
        })
      }
    })
  }
})