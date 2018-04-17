// widget/goodlist/goodlist.js
import { fecthBySkuIds, fecthCartAdd } from '../../api/index.js'
import { isLogin } from '../../utils/index.js'
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    goodlist: {
      type: Array,
      observer (val) {
        // console.log(val, 'good')
      }
    },
    tempData: {
      type: Object,
      observer (val) {
        if (val.goods_list && val.goods_list[this.data.item && this.data.item.module_id]) {
          let arr = []
          // console.log(this.data.item)
          this.data.item.conf.items.forEach(good => {
            val.goods_list[this.data.item && this.data.item.module_id].forEach(product => {
              if (+good.id == +product.sku_id) {
                product.diy = good
                arr.push(product)
              }
            })
          })
          if(arr.length> 0) {
            arr = this.sort(arr)
          }
          let skuIds = arr.map(item => {
            return item.sku_id
          })
          this.setData({
            goodlist: arr,
            skuIds: skuIds
          })
        } else {
          this.setData({
            goodlist: []
          })
        }
      }
    },
    item: {
      type: Object,
      observer (val) {
        // console.log(val, 'goodlist')
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    imgSrc: "../../assets/imgs/fruit.jpg",
    activeIdx: 0,
    toastText: '',
    skuIds: [],
    tabList: [
      { name: "默认" },
      // { name: "销量" },
      // { name: "热度" },
      { name: "价格" }
    ],
    isNoCart: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    goDetail (e) {
      let skuId = e.currentTarget.dataset.item.sku_id
      let spuId = e.currentTarget.dataset.item.spu_id
      wx.navigateTo({
          url: '/pages/goods/goods?skuId=' + skuId + '&spuId=' + spuId,
      })
    },
    bindErrImg(e) {
      console.log(this.data.goodlist)
      let index = e.target.dataset.imgindex
      this.data.goodlist[index].diy.pic = "../../assets/imgs/fruit.jpg"
      this.data.goodlist[index].sku_img = "../../assets/imgs/fruit.jpg"
      this.setData({
        goodlist: [].concat(this.data.goodlist)
      })
    },
    cartAdd(e) {
      let good = e.currentTarget.dataset.item
      if (!isLogin()) {
       wx.navigateTo({
         url: '/pages/loginType/loginType',
       })
        return
      }
      fecthCartAdd ({
        items: [{
          quantity: 1,
          skuId: good.sku_id,
          }
        ],
        user_id: app.globalData.userInfo.user_id
      }).then(res => {
        if (res.data && res.data.error) {
          // this.toast(res.data.error.message)
          wx.showToast({
            title: res.data.error.message,
            icon: 'none'
          })
        } else {
          if (!this.data.isNoCart) {
            let m = this.selectComponent('.goodlist-cart')
            m.getCartNum()
          }
          // this.toast("加入购物车成功")
          wx.showToast({
            title: '加入购物车成功',
            icon: 'none'
          })
        }
      }).catch(err => {
        console.log(err)
        // err.msg ? this.toast(err.msg) : this.toast("加入购物车失败")
        wx.showToast({
          title: err && err.msg ? err.msg : '加入购物车失败',
          icon: 'none'
        })
      })
    },
    sort(array) {
      for (var unfix = array.length - 1; unfix > 0; unfix--) {
        for (var i = 0; i < unfix; i++) {
          if ((array[i].diy.sort ? array[i].diy.sort : 0) < (array[i + 1].diy.sort ? array[i + 1].diy.sort : 0)) {
            var temp = array[i]
            array.splice(i, 1, array[i + 1])
            array.splice(i + 1, 1, temp)
          }
        }
      }
      return array
    },
    tabClick(e) {
      let index = e.currentTarget.dataset.index
      console.log(index,'xiab')
      let sortName = ''
      switch (index) {
        case 0:
          sortName = ""
          break
        case 1:
          sortName = "salePrice"
          break
        case 2:
          sortName = ""
          break
        case 3:
          sortName = "" 
          break
      }
      this.getList(this.data.skuIds, sortName)
      this.setData({
        activeIdx: index
      })
    },
    getList(skuIds = [], sort = '') {
      fecthBySkuIds({
        skuIds: skuIds,
        sortColumns: sort
      }).then(res => {
        this.setData({
          goodlist: res.data && res.data.skus || []
        })
      }).catch(err => {
        wx.showToast({
          title: err && err.msg ? err.msg : '获取列表失败',
          icon: 'none'
        })
        // this.toast("获取列表失败")
      })
    },
    toast(text) {
      let t = this.selectComponent('.toast')
      console.log('show',t)
      this.setData({
        toastText: text
      })
      t && t.show()
    }
  },
  ready () {
    let pageArr = getCurrentPages()
    let index = pageArr.length - 1
    if (pageArr[index].route == "pages/index/index") {
      this.setData({
        isNoCart: true
      })
    } else {
      this.setData({
        isNoCart: false
      })
    }
  }
})
