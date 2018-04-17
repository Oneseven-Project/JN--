// widget/toast/toast.js
let isDone = false
let timer = null

function show (self) {
  self.setData({
    isShow: false
  })
  if (isDone) {
    clearTimeout(timer)
    // return
  }
  clearTimeout(timer)
  self.setData({
    isShow: true
  })
  hide(self)
}

function hide (self) {
  timer = setTimeout(() => {
    self.setData({
      isShow: false
    })
  }, 2000)
}


Component({
  /**
   * 组件的属性列表
   */
  properties: {
    text:{
      type: String,
      vale: '默认提示'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    isShow: false,
    animationData: {}
  },
  /**
   * 组件的方法列表
   */
  methods: {
    show () {
      show(this)
    },
    changeStatus () {
      isDone = false
    }
  },
  ready () {
    isDone = false
  },
  detached() {
    clearTimeout(timer)
    isDone = true
  }
})
