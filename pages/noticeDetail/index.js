const request = require('../../common/request')
const { API_NOTICE_DETAIL } = require('../../common/constants')
const { formatDate } = require('../../common/util')

Page({
  data: {
    toast: '',
    name: '',
    createDate: '',
    context: ''
  },
  showToast: function (toast, duration = 1500) {
    this.setData({ toast })
    setTimeout(() => {
      this.setData({ toast: '' })
    }, duration)
  },
  // 事件处理函数
  bindViewTap: function() {
    
  },
  fetchData: function(id) {
    request({
      url: API_NOTICE_DETAIL,
      data: {
        noticeId: id
      },
      success: json => {
        this.setData({
          name: json.data.name,
          createDate: formatDate(new Date(json.data.create_date * 1000), 'yyyy-MM-dd hh:mm:ss'),
          context: json.data.context,
        })
      }
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
