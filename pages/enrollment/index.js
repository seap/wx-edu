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
    const { classId } = this.data 
    if (classId == '') {
      return this.showToast('请选择报名班级')
    }
    
    request({
      url: API_CLASS_ENROLL,
      data: {
        clazzId: classId
      },
      success: json => {
        try {
          wx.removeStorageSync('select-class')
          this.showToast('报名成功，请等待审核')
          setTimeout(() => {
            wx.navigateBack({ delta: 1 })
          }, 1600)
        } catch (e) {
          
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
      url: API_MEMBER_INFO,
      success: json => {
        this.setData({
          member: json.data
        })
      }
    })
  }
})