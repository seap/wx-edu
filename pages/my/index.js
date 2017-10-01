const request = require('../../common/request')
const { API_MEMBER_INFO } = require('../../common/constants')

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    member: null
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
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
      url: `${API_MEMBER_INFO}?openId=onhx6xBFsBnkS3-FPqtp1VZ3YM9U`,
      success: json => {
        this.setData({
          member: json.data
        })
      }
    })
  }
})