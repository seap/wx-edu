const request = require('../../common/request')
const { API_PASSWORD_UPDATE } = require('../../common/constants')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    oldPassword: '',
    newPassword: '',
    confirmedPassword: '',
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
    const { oldPassword, newPassword, confirmedPassword } = this.data
    if (newPassword !== confirmedPassword) {
      return this.showToast('确认密码不一致')
    }
    request({
      url: API_PASSWORD_UPDATE,
      data: {
        newpwd: newPassword,
        oldpwd: oldPassword
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