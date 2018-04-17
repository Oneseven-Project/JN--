// widget/countdown/countdown.js
let timer = null
let isDone = false
function setTime(time, self) {
  timer = setTimeout(function () {
    countDown(time, self)
  }, 1000)
}
function countDown(time,self) {
  if (isDone) {
    clearTimeout(timer)
    return
  }
  let leftTime = (new Date(+time)) - (new Date()) // 计算剩余的毫秒数
  if (+leftTime < 0 || +leftTime === 0) {
    clearTimeout(timer)
    self.day = '00'
    self.hour = '00'
    self.minute = '00'
    self.second = '00'
    self.triggerEvent('refresh')
    return
  }
  let days = parseInt(leftTime / 1000 / 60 / 60 / 24, 10) // 计算剩余的天数
  let hours = parseInt(leftTime / 1000 / 60 / 60 % 24, 10) // 计算剩余的小时
  let minutes = parseInt(leftTime / 1000 / 60 % 60, 10) // 计算剩余的分钟
  let seconds = parseInt(leftTime / 1000 % 60, 10) // 计算剩余的秒数
  self.setData({
    hour: checkTime(hours),
    minute: checkTime(minutes),
    second: checkTime(seconds),
  })
  setTime(time, self)
}
function checkTime(i) { // 将0-9的数字前面加上0，例1变为01
  if (i < 10) {
    i = '0' + i
  }
  return i
}

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    time: {
      type: Number,
      value: 0,
      observer (val) {
        console.log(val, 'timetimertime')
        countDown(val,this)
      }
    },
    isDown: {
      type: Number
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    hour: '',
    minute: '',
    second: ''
  },
  detached () {
    isDone = true
  },
  /**
   * 组件的方法列表
   */
  methods: {
    
  },
  ready () {
    isDone = false
    countDown(this.data.time,this)
  }
})
