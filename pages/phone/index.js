const request = require('../../common/request')
const { API_PHONE_UPDATE } = require('../../common/constants')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: '',
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

  bindInput: function(e) {
    this.setData({
      [e.target.id]: e.detail.value
    })
  },

  bindClearTap: function(e) {
    this.setData({
      [e.target.id]: ''
    })
  },

  bindSubmitTap: function() {
    const { phone } = this.data
    if (!/1\d{10}/.test(phone)) {
      return this.showToast('请输入正确的手机号')
    }
    request({
      url: API_PHONE_UPDATE,
      data: {
        phone
      },
      success: json => {
        this.showToast('修改成功')
        setTimeout(() => {
          wx.navigateBack({ delta: 1 })
        }, 1600)
      }
    })
  }
  
})