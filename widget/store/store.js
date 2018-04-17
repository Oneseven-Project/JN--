// widget/store/store.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    item: {
      type: Object,
      observer (val) {
        // console.log(val, 'storeCof')
      }
    },
    tempData: {
      type: Object,
      observer (val) {
        // console.log(val, 'storeData')
        this.setData({
          storeList: val.store_list && val.store_list[this.data.item.module_id] ? val.store_list && val.store_list[this.data.item.module_id] : []
        })
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    swiperItem: {},
    swiperData: {},
    storeList: []
  },

  /**
   * 组件的方法列表
   */
  methods: {
    inToStore (e) {
      let id = e.currentTarget.dataset.item && e.currentTarget.dataset.item.seller_id || ''
      wx.navigateTo({
        url: '/pages/storeList/storeList?seller_id=' + id,
      })
    }
  }
})
