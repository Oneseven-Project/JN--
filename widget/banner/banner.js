// components/banner/banner.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    item: {
      type: Object,
      observer (val) {
        console.log(val, 'banner')
        let that = this
        if (val.conf && val.conf.items){
          wx.getImageInfo({
            src: val.conf.items[0].pic,
            success (res) {
              that.setData({
                swiperHeiht: res.height/res.width * wx.getSystemInfoSync().windowWidth 
              })
            }
          })
        }
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    swiperHeiht: 0
  },
  /**
   * 组件的方法列表
   */
  methods: {
    goTo (e) {
      let item = e.currentTarget.dataset.item
      if (!item.id) {
        return
      }
      if (item.type == 'template') {
        wx.navigateTo({
          url: '/pages/custom/custom?id=' + item.id,
        })
      } else if (item.type == 'goods') {
        wx.navigateTo({
          url: '/pages/goods/goods?skuId=' + item.id + '&spuId=' + item.spu_id,
        })
      } else if (item.type == 'category') {
        wx.navigateTo({
          url: '/pages/classifyList/classifyList?id=' + item.id + '&parentId=' + item.parent_id,
        })
      }
    }
  }
})
