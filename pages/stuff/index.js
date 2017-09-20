const request = require('../../common/request')
const { API_HOST } = require('../../common/constants')
const { formatDate } = require('../../common/util')

Page({
  data: {
    classIndex: 0,
    classList: [],
    stuffList: []
  },
  bindClassChange: function(e) {
    const index = e.detail.value
    this.setData({
      classIndex: index
    })
    this.fetchStuffList(this.data.classList[index].clazz_id)
  },
  bindItemTap: function(e) {
    const { index } = e.currentTarget.dataset
    const item = this.data.stuffList[index]
    wx.navigateTo({
      url: `/pages/stuffDetail/index?id=${item.stuff_id}`
    })
  },
  fetchStuffList: function(classId) {
    request({
      url: `${API_HOST}/webservice/student/query_stuff?openId=onhx6xBFsBnkS3-FPqtp1VZ3YM9U&clazzId=${classId}`,
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
  onLoad: function() {
    request({
      url: `${API_HOST}/webservice/student/query_clazz?openId=onhx6xBFsBnkS3-FPqtp1VZ3YM9U`,
      success: json => {
        this.setData({
          classList: json.data
        })
        if (json.data[0]) {
          this.fetchStuffList(json.data[0].clazz_id)
        }
      }
    })
  }
})