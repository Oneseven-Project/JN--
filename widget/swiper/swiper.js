// widget/swiper/swiper.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    tempData: {
      type: [Object,Array],
      observer (val) {
        // console.log(val,'swiper')
        if (val.swiper_list && val.swiper_list[this.data.item.module_id]) {
          let arr = this.data.item.conf && this.data.item.conf.items && this.data.item.conf.items.map(good => {
            return val.swiper_list[this.data.item.module_id].find(swipe => {
              return good.id == swipe.sku_id
            })
          }).filter(good => good)
          this.setData({
            swiperList: arr
          })
        } else if(val && val.length > 0) {
          this.setData({
            swiperList: val
          })
        }
      }
    },
    item: {
      type: Object,
      observer (val) {
        // console.log(val)
      }
    },
    countTime: {
      type: Number,
      observer (val) {
        // console.log(val, 'swiper')
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    currentTime: new Date().getTime(),
    swiperList:[]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    seeMore (event) {
      wx.navigateTo({
        url: event.currentTarget.dataset.getUrl
      })
    },
    itemClick (e) {
      let item = e.currentTarget.dataset.item
      if(item.url) {
        wx.navigateTo({
          url: item.url,
        })
      } else if (item.type == 'template') {
        wx.navigateTo({
          url: '/pages/custom',
        })
      } else if (item.type == 'goods') {
        wx.navigateTo({
          url: '/pages/goods',
        })
      } else {
        let skuId = item.sku_id || ''
        let spuId = item.spu_id || ''
        wx.navigateTo({
          url: '/pages/goods/goods?skuId=' + skuId + '&spuId=' + spuId,
        })
      }
    },
    bindErrImg(e) {
      let index = e.target.dataset.imgindex
      this.data.swiperList[index].sku_img = "../../assets/imgs/fruit.jpg"
      this.setData({
        swiperList: [].concat(this.data.swiperList)
      })
    },
  }
})
