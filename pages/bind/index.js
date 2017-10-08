const { API_USER_BIND } = require('../../common/constants')
const request = require('../../common/request')
const app = getApp()

Page({

  data: {
    id: '',
    password: '',
    remark: '',
    userInfo: null,
    toast: ''
  },

  toastCursor: 0,
  showToast: function (toast, duration = 1500) {
    this.toastCursor++
    this.setData({ toast })
    setTimeout(() => {
      this.toastCursor--
      if (this.toastCursor === 0) {
        this.setData({ toast: '' })
      }
    }, duration)
  },

  bindInput: function (e) {
    this.setData({
      [e.target.id]: e.detail.value
    })
  },

  bindClearTap: function (e) {
    this.setData({
      [e.target.id]: ''
    })
  },

  bindRegister: function() {
    wx.navigateTo({
      url: '/pages/register/index'
    })
  },

  bindSubmitTap: function () {
    const { id, password, remark, userInfo = {} } = this.data
    if (!/\d{14}/.test(id)) {
      return this.showToast('请输入正确的学号')
    }
    request({
      url: API_USER_BIND,
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        studentNo: id,
        password,
        remark,
        nickname: userInfo.nickName || ''
      },
      success: json => {
        this.showToast('绑定成功')
        // 重新加载班级列表
        app.fetchClassList()
        setTimeout(() => {
          // 返回首页
          wx.reLaunch({
            url: '/pages/index/index'
          })
        }, 1800)
      }
    })
  },

  onLoad: function (options) {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo
      })      
    } else {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo
        })
      }
    }
  },
})