const request = require('../../common/request')
const { API_WRITEON_DETAIL } = require('../../common/constants')
const { formatDate } = require('../../common/util')

Page({
  data: {
    toast: '',
    writeonName: '',
    createDate: '',
    content: '',
    list: [],
    imageList: []
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
  // 事件处理函数
  bindViewTap: function() {
    
  },
  fetchData: function(id) {
    request({
      url: `${API_WRITEON_DETAIL}?openId=onhx6xBFsBnkS3-FPqtp1VZ3YM9U&writeonId=${id}`,
      success: json => {
        console.log(json)
        const imageList = json.data.writeon_attach.map(ele => ele.attach_url)
        this.setData({
          writeonName: json.data.writeon_name,
          createDate: formatDate(new Date(json.data.create_date * 1000), 'yyyy-MM-dd hh:mm:ss'),
          content: json.data.content,
          list: json.data.writeon_attach,
          imageList
        })
      }
    })
  },
  bindItemTap: function(e) {
    const { imageList } = this.data
    const { index } = e.currentTarget.dataset
    wx.previewImage({
      current: imageList[index],
      urls: imageList
    })
  },
  
  onLoad: function(options) {
    this.fetchData(options.id)
  },
  onShow: function() {
    
  },
  onUnload: function() {
  }
})
