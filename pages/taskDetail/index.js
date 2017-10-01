const request = require('../../common/request')
const { API_TASK_DETAIL, API_FILE_UPLOAD } = require('../../common/constants')
const { formatDate } = require('../../common/util')

Page({
  data: {
    recording: false,
    localFiles: [],
    toast: ''
  },

  showToast: function (toast, duration = 1500) {
    this.setData({ toast })
    setTimeout(() => {
      this.setData({ toast: '' })
    }, duration)
  },

  fetchData: function(id) {
    request({
      url: `${API_TASK_DETAIL}?openId=onhx6xBFsBnkS3-FPqtp1VZ3YM9U&taskId=${id}`,
      success: json => {
        this.setData({
          ...json.data,
          createDate: formatDate(new Date(json.data.create_date * 1000), 'yyyy-MM-dd hh:mm:ss'),
        })
      }
    })
  },

  saveTask: function() {
    this.uploadLocalFiles()
  },

  uploadLocalFiles: function() {
    const { localFiles } = this.data
    localFiles.forEach(ele => {
      const { filePath, name } = ele
      wx.uploadFile({
        url: API_FILE_UPLOAD, //仅为示例，非真实的接口地址
        filePath,
        name: 'file',
        formData:{
          name
        },
        success: function(res){
          console.log('upload success: ', res)
          var data = res.data
          //do something
        },
        fail: err => {
          console.log(err)
        }
      })
    })
  },

  bindRecordTap: function() {
    console.log('bindRecordTap')
    const { recording } = this.data
    if (!recording) {
      this.setData({
        recording: true
      })
      wx.startRecord({
        success: res => {
          const tempFilePath = res.tempFilePath 
          console.log('res: ', res)
          this.addLocalFile({
            name: 'VOICE - ' + formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss'),
            filePath: tempFilePath
          })
        },
        fail: function(res) {
           //录音失败
        },
        complete: () => {
          this.setData({ recording: false })
        }
      })
    } else {
      console.log('stop record')
      wx.stopRecord()
      this.setData({
        recording: false
      })
    }
  },

  bindLocalFileTap: function(e) {
    console.log(e)
    const { filepath } = e.currentTarget.dataset
    wx.playVoice({
      filePath: filepath.replace(/^http:/, 'https:'),
      complete: function(){
      }
    })
  },

  bindRemoteFileTap: function(e) {
    const { filepath } = e.currentTarget.dataset
    console.log('play filepath: ', filepath)
    wx.playBackgroundAudio({
      dataUrl: filepath,
      success: () => {
        this.showToast('播放成功')
        console.log('play success ')
      },
      fail: err => {
        this.showToast('播放失败')
        console.log('play fail: ', err)
      }
    })
  },

  addLocalFile: function(file) {
    const { localFiles } = this.data
    this.setData({
      localFiles: [...localFiles, file]
    })
  },

  removeLocalFile: function(e) {
    const { index } = e.currentTarget.dataset
    const { localFiles } = this.data
    localFiles.splice(index, 1)
    this.setData({ localFiles })
  },

  onLoad: function (options) {
    this.fetchData(options.id)
  },
})