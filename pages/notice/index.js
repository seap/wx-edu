const request = require('../../common/request')
const { API_NOTICE, API_CLASS } = require('../../common/constants')
const { formatDate } = require('../../common/util')

Page({
  data: {
    classIndex: 0,
    classList: [],
    list: null
  },
  bindClassChange: function(e) {
    const index = e.detail.value
    this.setData({
      classIndex: index
    })
    this.fetchList(this.data.classList[index].clazz_id)
  },
  bindItemTap: function(e) {
    const { index } = e.currentTarget.dataset
    const item = this.data.list[index]
    wx.navigateTo({
      url: `/pages/noticeDetail/index?id=${item.id}`
    })
  },
  fetchList: function(id) {
    request({
      url: `${API_NOTICE}?openId=onhx6xBFsBnkS3-FPqtp1VZ3YM9U&clazzId=${id}`,
      success: json => {
        this.setData({
          list: json.data.map(ele => {
            ele.createDate = formatDate(new Date(ele.create_date * 1000), 'yyyy-MM-dd hh:mm:ss')
            return ele
          })
        })
      }
    })
  },
  onLoad: function() {
    request({
      url: `${API_CLASS}?openId=onhx6xBFsBnkS3-FPqtp1VZ3YM9U`,
      success: json => {
        this.setData({
          classList: json.data
        })
        if (json.data[0]) {
          this.fetchList(json.data[0].clazz_id)
        }
      }
    })
  }
})