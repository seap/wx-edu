const request = require('../../common/request')
const { parseSecond } = require('../../common/util')

Page({
  data: {
    stuffName: '',
    list: [],
    isPlaying: false,
    title: '',
    dataUrl: '',
    dataIndex: -1,
    isCycle: false, // 0: all, 1: single
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
        this.setData({
          stuffName: json.data.stuff_name,
          list: json.data.stuff_attach.map(ele => {
            ele.type = /mp3/.test(ele.attach_type) ? 'mp3' : 'pdf'
            return ele
          })
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
      this.play({
        dataIndex: index,
        dataUrl: item.attach_url,
        title: item.attach_name
      })
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
    const step = e.detail.value
    const { duration } = this.data
    if (duration > 0) {
      wx.seekBackgroundAudio({
        position: parseInt(step * duration / 100),
      })
      this.setData({
        step
      })
    }
  },
  bindPlayTap: function(e) {
    const { isPlaying, title, dataUrl } = this.data
    if (isPlaying) {
      this.pause()
    } else {
      if (dataUrl) {
        this.play({ title, dataUrl })
      } else {
        this.showToast('请选择播放的音频')
      }
    }
  },
  bindCycleTap: function (e) {
    const { isCycle } = this.data
    this.setData({
      isCycle: !isCycle
    })
  },
  play: function(audio){
    wx.playBackgroundAudio({
      ...audio,
      success: res => {
        wx.setStorage({
          key: 'audio',
          data: audio
        })
        this.setData({
          isPlaying: true,
          ...audio
        })
      }, 
      fail: err => {
        this.showToast('播放文件失败')
      }
    })
  },
  onPlay: function() {
    console.log('onPlay.....')
    this.interval = setInterval(() => {
      wx.getBackgroundAudioPlayerState({
        success: obj => {
          console.log('state: ', obj)
          try {
            const { status, currentPosition, dataUrl, duration } = obj
            if (status == 2) {
              return
            }
            let { title } = this.data
            const step = parseInt((currentPosition / duration) * 100)
            if (title == '') {
              const audio = wx.getStorageSync('audio')
              if (audio) {
                title = audio.title
              }
            }
            this.setData({
              isPlaying: status == 1,
              current: parseSecond(currentPosition),
              total: parseSecond(duration),
              duration,
              step,
              title,
              dataUrl
            })
          } catch (error) {
            console.log(error)
            this.showToast('播放异常')
          }
          // const { list } = this.data
          // for (let i = 0; i <= list.length; i++) {
          //   if (list[i].attach_url == dataUrl) {
          //     this.setData({
          //       dataIndex: i,
          //       dataUrl,
          //       title: list[i].attach_name
          //     })
          //     break
          //   }
          // }

        }
      })
    }, 1000)
  },
  pause: function() {
    wx.pauseBackgroundAudio()
  },
  onPause: function() {
    this.setData({
      isPlaying: false
    })
  },
  prev: function() {
    const { dataIndex, list } = this.data
    const nextIndex = (dataIndex <= 0) ? list.length - 1 : dataIndex - 1
    const item = list[nextIndex]
    if (!item || !item.attach_url || item.type !== 'mp3') {
      this.setData({
        dataIndex: nextIndex
      })
      return
    }
    this.play({
      dataIndex: nextIndex,
      dataUrl: item.attach_url,
      title: item.attach_name
    })
  },
  next: function() {
    const { dataIndex, list } = this.data
    const nextIndex = (dataIndex == list.length - 1) ? 0 : dataIndex + 1
    const item = list[nextIndex]
    if (!item || !item.attach_url || item.type !== 'mp3') {
      this.setData({
        dataIndex: nextIndex
      })
      return
    }
    this.play({
      dataIndex: nextIndex,
      dataUrl: item.attach_url,
      title: item.attach_name
    })
  },
  onStop: function(res) {
    console.log('stop: ', this)
    const { isCycle, index, list, title, dataUrl } = this.data
    if (isCycle) {
      // 单曲循环
      this.play({ title, dataUrl })
    } else {
      // 下一首
      // this.next()
    }
    // this.setData({
    //   step: 0,
    //   isPlaying: false
    // })
  },
  onLoad: function(options) {
    this.fetchData(options.id)
    // wx.onBackgroundAudioPlay(this.onPlay)
    wx.onBackgroundAudioPause(this.onPause)
    wx.onBackgroundAudioStop(this.onStop)
  },
  onShow: function() {    
    this.onPlay()
  }, 
  onHide: function() {
    if (this.interval) {
      clearInterval(this.interval)
      this.interval = null
    }
  }
})
