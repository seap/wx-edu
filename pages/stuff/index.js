const request = require('../../common/request')
const { API_STUFF } = require('../../common/constants')
const { formatDate } = require('../../common/util')
const app = getApp()

Page({
  data: {
    classIndex: 0,
    classList: [],
    stuffList: []
  },

  bindClassChange: function(e) {
    const index = e.detail.value
    if (index !== this.data.classIndex) {
      this.setData({
        classIndex: index
      })
      this.fetchList(this.data.classList[index].clazz_id)
    }
  },

  bindItemTap: function(e) {
    const { index } = e.currentTarget.dataset
    const item = this.data.stuffList[index]
    wx.navigateTo({
      url: `/pages/stuffDetail/index?id=${item.stuff_id}`
    })
  },

  fetchList: function(id) {
    request({
      url: `${API_STUFF}?openId=onhx6xBFsBnkS3-FPqtp1VZ3YM9U&clazzId=${id}`,
      success: json => {
        this.setData({
          stuffList: json.data.map(ele => {
            ele.stuffDate = formatDate(new Date(ele.create_date * 1000), 'yyyy-MM-dd hh:mm:ss')
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