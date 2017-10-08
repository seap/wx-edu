const request = require('../../common/request')
const { API_CLASS_LIST } = require('../../common/constants')

Page({
  data: {
    list: []
  },

  onLoad: function () {
    this.fetchList()
  },

  fetchList: function() {
    request({
      url: API_CLASS_LIST,
      success: json => {
        this.setData({
          list: json.data
        })
      }
    })
  },

  bindItemTap: function(e) {
    const { list } = this.data
    const { index } = e.currentTarget.dataset
    const { clazz_name, id } = list[index]
    try {
      wx.setStorageSync('select-class', {
        name: clazz_name, 
        id 
      })
      wx.navigateBack({ delta: 1 })
    } catch (e) {
    }
  }

})