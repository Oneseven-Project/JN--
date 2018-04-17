// widget/jn-ad/jn-ad.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    adItem: {
      type: [Object, Array],
      observer (val) {
        console.log(val, '磨脚')
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
