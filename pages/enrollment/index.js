const request = require('../../common/request')
const { API_MEMBER_INFO, API_CLASS_ENROLL } = require('../../common/constants')

Page({
  data: {
    classId: '',
    className: ''
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

  bindClassSelectTap: function() {
    wx.navigateTo({
      url: '/pages/classSelector/index'
    })
  },

  bindSubmitTap: function() {
    if (this.classId == '') {
      return this.showToast('请选择报名班级')
    }
    
    request({
      url: `${API_CLASS_ENROLL}?openId=onhx6xBFsBnkS3-FPqtp1VZ3YM9U`,
      success: json => {
        try {
          wx.removeStorageSync('select-class')
        } catch (e) {
          this.showToast('报名成功')
          setTimeout(() => {
            wx.navigateBack({ delta: 1 })
          }, 1600)
        }
      }
    })
  },

  onShow: function() {
    try {
      const selectedClass = wx.getStorageSync('select-class')
      if (selectedClass && selectedClass.id) {
        this.setData({
          classId: selectedClass.id,
          className: selectedClass.name
        })
      }
    } catch (e) {
      // Do something when catch error
    }
  },

  onLoad: function() {
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