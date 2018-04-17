// widget/cart/cart.js
import { fecthCartSize } from "../../api/index.js"
import { isLogin } from '../../utils/index.js'
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    cartNum: 0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    getCartNum () {
      fecthCartSize({
        user_id: app.globalData.userInfo.user_id
      }).then(res => {
        this.setData({
          cartNum: res.data
        })
      }).catch(err => {
        console.log(err)
      })
    },
    toCart() {
      if (isLogin()) {
        wx.switchTab({
          url: '/pages/cart/cart',
        })
      } else {
        wx.navigateTo({
          url: '/pages/loginType/loginType',
        })
      }
    }
  },
  ready() {
    if(isLogin()){
      this.getCartNum()
    }
  }
})

