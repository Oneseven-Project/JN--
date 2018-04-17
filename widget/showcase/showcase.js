// widget/showcase/showcase.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    item: {
      type: Object,
      observer(val){
        // console.log(val, 'showcase')
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
    goto (e) {
      let item = e.currentTarget.dataset.item
      if(!item.id){
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
