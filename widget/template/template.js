// template.js
let app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    item: {
      type: Object,
      observer (newVal, oldVal) {
        // console.log('templateItem', newVal, oldVal)
      }
    },
    tempData:{
      type: Object,
      observer (val) {
        // console.log(val, 'templatedata')
      }
    },
    countTime: {
      type: Number
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    style: 1
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
