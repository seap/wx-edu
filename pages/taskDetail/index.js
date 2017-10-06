const request = require('../../common/request')
const { API_TASK_DETAIL, API_TASK_SAVE, API_TASK_SUBMIT, API_FILE_UPLOAD } = require('../../common/constants')
const { formatDate } = require('../../common/util')

// 上传本地录音文件
let remoteFiles = []
function uploadFiles(localFiles, success, fail) {
  if (localFiles && localFiles.length === 0) {
    return success(remoteFiles)
  }
  const { filePath, name } = localFiles[0]
  wx.uploadFile({
    url: API_FILE_UPLOAD,
    filePath,
    name: 'file',
    formData:{
      name
    },
    success: res => {
      // console.log('upload success: ', res)
      if (!res || !res.data) {
        return fail()
      }
      try {
        const obj = JSON.parse(res.data)
        if (!obj || !obj.filename) {
          return fail()
        }
        remoteFiles.push({
          name,
          student_answer: obj.filename
        })
        uploadFiles(localFiles.slice(1), success, fail)
      } catch (error) {
        return fail()
      }
      
    },
    fail: err => {
      return fail()
    }
  })
}

Page({
  data: {
    recording: false,
    localFiles: [],
    student_answers: [], // 学生回答,远程文件
    countdown: 0, // 录音倒计时
    toast: ''
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
    const { recording } = this.data
    if (recording) {
      return this.showToast('正在录音中，请先结束录音')
    }
    this.uploadLocalFiles()
  },

  submitTask: function() {
    const { recording, task_id, localFiles, student_answers } = this.data
    if (recording) {
      return this.showToast('正在录音中，请先结束录音')
    }
    if (student_answers.length == 0) {
      return this.showToast('没有任何作业，无法提交')
    }
    wx.showModal({
      title: '提示',
      content: '作业提交后将无法修改，确认提交？',
      success: res => {
        if (res.confirm) {
          request({
            url: API_TASK_SUBMIT,
            method: 'POST',
            header: {
              'content-type': 'application/x-www-form-urlencoded' // 默认值
            },
            data: {
              openId: 'onhx6xBFsBnkS3-FPqtp1VZ3YM9U', 
              taskId: task_id,
              studentAnswers: JSON.stringify(student_answers)
            },
            success: json => {
              this.setData({
                ...json.data,
                createDate: formatDate(new Date(json.data.create_date * 1000), 'yyyy-MM-dd hh:mm:ss'),
              })
              this.showToast('提交成功')
              setTimeout(() => {
                wx.navigateBack({ delta: 1 })
              }, 1600)
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })  
  },

  uploadLocalFiles: function() {
    const { task_id, localFiles, student_answers } = this.data
    remoteFiles = []
    uploadFiles(localFiles, files => {
      // 上传成功
      console.log('本地文件上传成功')
      const latestAnswers = [...student_answers, ...files]
      // this.setData({
      //   localFiles: [],
      //   student_answers: latestAnswers
      // })
      request({
        url: API_TASK_SAVE,
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded' // 默认值
        },
        data: {
          openId: 'onhx6xBFsBnkS3-FPqtp1VZ3YM9U', 
          taskId: task_id,
          studentAnswers: JSON.stringify(latestAnswers)
        },
        success: json => {
          this.setData({
            localFiles: [],
            ...json.data,
            createDate: formatDate(new Date(json.data.create_date * 1000), 'yyyy-MM-dd hh:mm:ss'),
          })
          this.showToast('保存成功')
        }
      })
    }, () => {
      this.showToast('上传失败')
    })
  },
  startCounting: function() {
    
    this.setData({
      countdown: 60
    }, () => {
      this.timer = setInterval(() => {
        let { countdown } = this.data
        // console.log('countdown: ', countdown)
        if (countdown > 0) {
          this.setData({
            countdown: --countdown
          })
        } else {
          clearInterval(this.timer)
          this.timer = null
        }
      }, 1000)
    })
  },
  stopCounting: function() {
    if (this.timer) {
      clearInterval(this.timer)
      this.timer = null
    }
    this.setData({
      recording: false,
      countdown: 0
    })
  },
  bindRecordTap: function() {
    console.log('bindRecordTap')
    const { recording } = this.data
    if (!recording) {
      this.setData({
        recording: true
      })
      this.showToast('录音开始')
      this.startCounting()
      wx.startRecord({
        success: res => {
          const tempFilePath = res.tempFilePath 
          this.addLocalFile({
            name: 'VOICE ' + formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss'),
            filePath: tempFilePath
          })
          this.showToast('录音结束')
          this.stopCounting()
        },
        fail: function(res) {
          // 录音失败
          this.showToast('录音失败')
          this.stopCounting()
          console.log(res)
        },
        complete: () => {
          this.setData({ recording: false })
        }
      })
    } else {
      console.log('stop record')
      wx.stopRecord()
      this.stopCounting()
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
        this.showToast('播放录音')
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

  removeRemoteFile: function(e) {
    wx.showModal({
      title: '提示',
      content: '确认删除此条录音记录？',
      success: res => {
        if (res.confirm) {
          const { index } = e.currentTarget.dataset
          const { student_answers } = this.data
          student_answers.splice(index, 1)
          this.setData({ student_answers })
          this.showToast('删除成功')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })   
  },

  removeLocalFile: function(e) {
    wx.showModal({
      title: '提示',
      content: '确认删除此条录音记录？',
      success: res => {
        if (res.confirm) {
          const { index } = e.currentTarget.dataset
          const { localFiles } = this.data
          const deletedFiles = localFiles.splice(index, 1)
          this.setData({ localFiles })
          this.showToast('删除成功')
          // 手机上测试，发现只是临时文件，无法删除
          // wx.removeSavedFile({
          //   filePath: deletedFiles[0].filePath,
          //   success: () => {
          //     this.setData({ localFiles })
          //     this.showToast('删除成功')
          //   },
          //   fail: err => {
          //     console.log('remove file failed: ', err)
          //   }
          // })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })    
  },

  onLoad: function (options) {
    this.fetchData(options.id)
  },
})