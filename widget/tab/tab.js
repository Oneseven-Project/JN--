// widget/tab/tab.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    tabs: {
      type: Array,
      observer: (val) => {
        // console.log(val, 'tab')
      }
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    activatedIdx: 0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    goTab(tab) {
      var tabDetail = {
        item: tab.currentTarget.dataset.item,
        index: tab.currentTarget.dataset.index
      }
      this.triggerEvent('tabCLick', tabDetail)
      this.setData({
        activatedIdx: tab.currentTarget.dataset.index,
        toView: tab.currentTarget.id
      })
    }
  }
})
