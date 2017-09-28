const { parseSecond } = require('./util')

const data = {
  status: 2, // 播放状态（2：没有音乐在播放，1：播放中，0：暂停中）
  title: '',
  dataUrl: '',
  index: -1,
  playlist: [],
  step: 0,
  current: '00:00',
  total: '00:00',
  duration: 0,
  cycle: 0 // 0: 不循环， 1: 全曲循环， 2： 单曲循环 
}

function play(index = data.index, playlist = data.playlist) {
  const { title, dataUrl } = playlist[index]
  wx.playBackgroundAudio({
    title,
    dataUrl,
    success: res => {
      console.log('play success: ', res)
      data.index = index
      data.status = 1
      if (playlist) {
        // 重置播放列表
        data.playlist = playlist
      }
    }, 
    fail: err => {
    }
  })      
}

function pause() {
  wx.pauseBackgroundAudio()
}

function seek(step, callback) {
  const { duration } = data
  if (duration <= 0) {
    return
  }
  wx.seekBackgroundAudio({
    position: parseInt(step * duration / 100),
    success: () => {
      callback(step)
    }
  })
}

function prev() {
  const { index, playlist = [] } = data
  if (playlist.length == 0) {
    console.log('playlist is empty')
    return
  }
  const prevIndex = (index <= 0) ? playlist.length - 1 : index - 1
  play(prevIndex)
}

function next() {
  const { index, playlist = [] } = data
  if (playlist.length == 0) {
    console.log('playlist is empty')
    return
  }
  const nextIndex = (index == playlist.length - 1) ? 0 : index + 1
  play(nextIndex)
}

function cycle(cycle) {
  data.cycle = cycle
}

function onStop(res) {
  const { cycle } = data
  if (cycle === 2) {
    // 单曲循环
    play()
  } else if (cycle === 1) {
    // 下一首
    next()
  }
}

wx.onBackgroundAudioStop(onStop)

function addPlayerListener(callback) {
  data.interval = setInterval(() => {
    wx.getBackgroundAudioPlayerState({
      success: obj => {
        const { status, currentPosition = 0, duration = 0, dataUrl = '' } = obj
        data.duration = duration
        callback && callback({
          status,
          current: parseSecond(currentPosition),
          total: parseSecond(duration),
          step: duration > 0 ? parseInt((currentPosition / duration) * 100) : 0,
          title: data.playlist[data.index].title,
          playIndex: data.index,
          dataUrl,
          cycle: data.cycle
        })
      }
    })
  }, 500)
}

function removePlayerListener() {
  if (data.interval) {
    clearInterval(data.interval)
    data.interval = null
  }
}

module.exports = {
  play,
  pause,
  prev,
  next,
  seek,
  cycle,
  addPlayerListener,
  removePlayerListener
}