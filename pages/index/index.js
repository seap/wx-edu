const app = getApp()

Page({
  data: {
    userInfo: null,
    shortcuts: [
      { name: '班级通告', desc: '班级通知通告', image: '/assets/index/message.png', link: '/pages/notice/index' }, 
      { name: '我的作业', desc: '课程作业批注', image: '/assets/index/task.png', link: '/pages/task/index' },      
      { name: '课程板书', desc: '课程介绍板书', image: '/assets/index/writeon.png', link: '/pages/writeon/index' },
      { name: '辅导材料', desc: '课程辅导材料 ', image: '/assets/index/resource.png', link: '/pages/stuff/index' }
    ],
    linkList: [
      { name: '个人信息', image: '/assets/user.png', link: '/pages/my/index' },
      { name: '修改密码', image: '/assets/password.png', link: '/pages/password/index' },
      { name: '修改手机', image: '/assets/mobile.png', link: '/pages/phone/index' },
      // { name: '班级报名', image: '/assets/register.png', link: '/pages/enrollment/index' }
    ]
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
  bindViewTap:  function() {
    wx.navigateTo({
      url: '/pages/my/index'
    })
  },
  bindStuff: function() {
    wx.navigateTo({
      url: '/pages/stuff/index'
    })
  },
  bindShortCutTap: function(e) {
    const { link } = e.currentTarget.dataset
    if (link) {
      wx.navigateTo({
        url: link
      }) 
    } else {
      this.showToast('敬请期待')
    }
  },

  bindLinkListTap: function(e) {
    const { link } = e.currentTarget.dataset
    if (link) {
      wx.navigateTo({
        url: link
      }) 
    } else {
      this.showToast('敬请期待')
    }
  },

  onLoad: function (options) {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo
      })
    // } else if (wx.canIUse('button.open-type.getUserInfo')){
      
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo
        })
      }
    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})