const request = require('../../common/request')
const { API_TASK } = require('../../common/constants')
const { formatDate, askForEnrollment } = require('../../common/util')
const app = getApp()

// task status: nocom: 待完成, corre: 已提交待批改, compl: 已完成
Page({
  data: {
    classIndex: 0,
    classList: [],
    tabIndex: 0,
    tabs: [
      { id: 0, name: '当前作业' },
      { id: 1, name: '已批改作业' }
    ],
    currentList: null,
    completedList: null
  },

  bindClassChange: function (e) {
    const index = e.detail.value    
    if (index !== this.data.classIndex) {
      this.setData({
        classIndex: index
      })
      this.fetchList(this.data.classList[index].clazz_id)
    }
  },

  bindTabChange(e) {
    const tabIndex = e.currentTarget.dataset.id
    this.setData({
      linePosition: e.target.offsetLeft + 'px',
      tabIndex   
    })
  },

  bindItemTap: function(e) {
    const { id } = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/taskDetail/index?id=${id}`
    })
  },

  fetchList: function(id) {
    request({
      url: API_TASK,
      data: {
        clazzId: id
      },
      success: json => {
        this.list = json.data.map(ele => {
          ele.createDate = formatDate(new Date(ele.create_date * 1000), 'yyyy-MM-dd hh:mm:ss')
          return ele
        })
        const currentList = this.list.filter(ele => ele.status !== 'compl')
        const completedList = this.list.filter(ele => ele.status == 'compl')
        this.setData({
          currentList,
          completedList
        })
      }
    })
  },

  initClassList: function(classList) {
    const { classIndex } = this.data
    this.setData({
      classList
    })
    if (classList[classIndex]) {
      this.fetchList(classList[classIndex].clazz_id)
    } else {
      askForEnrollment()
    }
  },

  onShow: function() {
    if (app.globalData.classList) {
      this.initClassList(app.globalData.classList)
    } else {
      app.classListCallback = this.initClassList
    }
  }
})