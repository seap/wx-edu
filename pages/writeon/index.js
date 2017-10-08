const request = require('../../common/request')
const { API_CLASS, API_WRITEON } = require('../../common/constants')
const { formatDate, askForEnrollment } = require('../../common/util')
const app = getApp()

Page({
  data: {
    classIndex: 0,
    classList: [],
    list: []
  },
  bindClassChange: function (e) {
    const index = e.detail.value    
    if (index !== this.data.classIndex) {
      this.setData({
        classIndex: index
      })
      this.fetchList(this.data.classList[index].clazz_id)
    }
  },
  bindItemTap: function (e) {
    const { index } = e.currentTarget.dataset
    const item = this.data.list[index]
    wx.navigateTo({
      url: `/pages/writeonDetail/index?id=${item.writeon_id}`
    })
  },
  fetchList: function (id) {
    request({
      url: API_WRITEON,
      data: {
        clazzId: id
      },
      success: json => {
        this.setData({
          list: json.data.map(ele => {
            ele.writeonDate = formatDate(new Date(ele.create_date * 1000), 'yyyy-MM-dd hh:mm:ss')
            return ele
          })
        })
      }
    })
  },
  initClassList: function(classList) {
    this.setData({
      classList
    })
    if (classList[0]) {
      this.fetchList(classList[0].clazz_id)
    } else {
      askForEnrollment()
    }
  },
  onLoad: function() {
    if (app.globalData.classList) {
      this.initClassList(app.globalData.classList)
    } else {
      app.classListCallback = this.initClassList
    }
  }
})