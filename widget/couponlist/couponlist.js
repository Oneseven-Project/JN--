// widget/couponlist/couponlist.js
import {
  fecthGetCoupons
} from '../../api/index.js'
import { isLogin } from '../../utils/index.js'
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    item: {
      type: Object,
      observer(val) {
        let couponIds = val.conf && val.conf.items.map(item => item.id)
        if (couponIds.length) {
          this.setData({
            couponIds: couponIds
          })
        }
      }
    },
    tempData: {
      type: Object,
      observer(val) {
        // console.log(val, 'dataaaaa')
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    couponIds: []
  },

  /**
   * 组件的方法列表
   */
  methods: {
    drawCoupon () {
      // 批量领取红包
      if (!isLogin()) {
        wx.navigateTo({
          url: '/pages/loginType/loginType',
        })
        return
      }
      this.getCoupons()
    },
    getCoupons () {
      fecthGetCoupons({
        couponIds: this.data.couponIds,
        userId: app.globalData.userInfo.user_id
      }).then(res => {
        if (res.success) {
          wx.showToast({
            title: '领取红包成功',
            icon: 'none'
          })
        }
      }).catch(err => {
        wx.showToast({
          title: err && err.msg ? err.msg : '领取红包失败',
          icon: 'none'
        })
      })
    }
  }
})
