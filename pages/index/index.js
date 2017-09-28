const app = getApp()

Page({
  data: {
    userInfo: null,
    shortcuts: [
      { name: '班级通告', desc: '班级通知通告', image: '/assets/index/message.png', link: '/pages/notice/index' }, 
      { name: '我的作业', desc: '课程作业批注', image: '/assets/index/task.png', link: '' },      
      { name: '课程板书', desc: '课程介绍板书', image: '/assets/index/writeon.png', link: '/pages/writeon/index' },
      { name: '辅导材料', desc: '课程辅导材料 ', image: '/assets/index/resource.png', link: '/pages/stuff/index' }
    ],
    linkList: [
      { name: '修改密码', image: '/assets/password.png', link: '' },
      { name: '修改手机号', image: '/assets/mobile.png', link: '' }
    ]
  },

  bindStuff: function() {
    wx.navigateTo({
      url: '/pages/stuff/index'
    })
  },
  bindShortCutTap: function(e) {
    const { link } = e.currentTarget.dataset
    link && wx.navigateTo({
      url: link
    })
  },

  onLoad: function (options) {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo
      })
    } else if (wx.canIUse('button.open-type.getUserInfo')){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo
        })
      }
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

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})