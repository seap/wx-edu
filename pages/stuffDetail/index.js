const request = require('../../common/request')
const player = getApp().player

Page({
  data: {
    stuffName: '',
    list: [],
    playlist: [],
    status: 2, // 2：没有音乐在播放，1：播放中，0：暂停中
    title: '',
    dataUrl: '',
    playIndex: -1,
    cycle: 0, // 0: no cycle, 1: all, 2: single
    duration: 0,
    step: 0, // slider的步数
    total: '00:00',
    current: '00:00',
    toast: ''
  },
  interval: null,
  showToast: function (toast, duration = 1500) {
    this.setData({ toast })
    setTimeout(() => {
      this.setData({ toast: '' })
    }, duration)
  },
  //事件处理函数
  bindViewTap: function() {
    
  },
  fetchData: function(stuffId) {
    request({
      url: `http://w.jenniferstudio.cn/webservice/student/query_stuff_info?openId=onhx6xBFsBnkS3-FPqtp1VZ3YM9U&stuffId=${stuffId}`,
      success: json => {
        let audioIndex = 0, pdfIndex = 0
        const list = json.data.stuff_attach.map(ele => {
          ele.dataUrl = ele.attach_url
          ele.title = ele.attach_name
          if (/mp3/.test(ele.attach_type)) {
            ele.type = 'mp3'
            ele.audioIndex = audioIndex++
          } else {
            ele.type = 'pdf'
            ele.pdfIndex = pdfIndex++
          }
          return ele
        })
        const playlist = list.filter(ele => ele.type == 'mp3')
        this.setData({
          stuffName: json.data.stuff_name,
          list,
          playlist
        })
      }
    })
  },
  bindItemTap: function(e) {
    const { index } = e.currentTarget.dataset
    const item = this.data.list[index]
    if (!item || !item.attach_url) {
      return
    }
    if (item.type == 'mp3') {
      player.play(item.audioIndex, this.data.playlist)
    } else {
      this.openPdf(item.attach_url)
    }
  },
  openPdf: function(pdf) {
    wx.showLoading({ title: '加载中' })
    wx.downloadFile({
      url: pdf,
      success: res => {
        wx.openDocument({
          filePath: res.tempFilePath,
          success: res => {
            console.log('打开文档成功')
          },
          fail: err => {
            console.log(err)
            wx.showModal({ title: '打开文档失败' })
          }
        })
      },
      fail: () => {
        wx.showModal({ title: '文件下载失败' })
        // this.showToast('文件下载失败')
      },
      complete: () => {
        wx.hideLoading()
      }
    })
  },
  bindSliderChange: function(e) {
    player.seek(e.detail.value, step => {
      this.setData({
        step
      })
    })
  },
  bindPlayTap: function(e) {
    const { status } = this.data
    if (status == 0) {
      player.play()
    } else if(status == 1) {
      player.pause()
    } else {
      this.showToast('请选择播放的音频')  
    }
  },
  bindCycleTap: function (e) {
    const cycle = (this.data.cycle + 1) % 3
    player.cycle(cycle)
    this.setData({
      cycle
    }, () => {
      this.showToast(cycle == 0 ? '取消循环' : cycle == 1 ? '全曲循环' : '单曲循环')  
    })
  },
  prev: function() {
    player.prev()
  },
  next: function() {
    player.next()
  },
  onLoad: function(options) {
    this.fetchData(options.id)
    player.addPlayerListener(data => {
      this.setData(data)
    })
  },
  onShow: function() {
    
  },
  onUnload: function() {
    player.removePlayerListener()
  }
})
