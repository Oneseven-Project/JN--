// widget/showmodel/showmodel.js
import { fecthCartDelecte } from "../../api/index.js"
const qs = require('../../assets/js/qs.js')
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    option: {
      type: Object,
      observer (val) {
        console.log(val)
      }
    },
    addressInfo: {
      type: Object
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    isShow: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    show () {
      this.setData({
        isShow: true
      })
    },
    hide () {
      this.setData({
        isShow: false
      })
    },
    btn2 () {
      this.hide()
      if (this.data.option.btn2 == "继续结算") {
        wx.navigateTo({
          url: '../../pages/statement/statement?' + qs.stringify(cartId, { arrayFormat: 'repeat' })
        })
      }
      if (this.data.option.resp_type == 2) {
        wx.switchTab({
          url: '/pages/index/index',
        })
      }
      if (this.data.option.resp_type == 3) {
        // 移除部分售罄商品
        let cartId = this.data.option.list.map(item => {
          return item.cart_item_id
        })
        fecthCartDelecte({
          "cart_item_ids": cartId,
          "region_id": 0,
          "user_id": app.globalData.userInfo.user_id
        }).then(res => {
          this.triggerEvent('getCartList')
        }).catch(err => {
          // err && err.msg ? this.toast(err.msg) : this.toast('移除失败')
          wx.showToast({
            title: err && err.msg ? err.msg : '移除失败',
            icon: 'none'
          })
        })
      }
    }
  }
})
