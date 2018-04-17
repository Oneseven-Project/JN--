// widget/redpacket/jn-redpacket.js
import {
  fecthCoponByIds,
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
      observer (val) {
        // console.log(val, 'item')
        let couponIds = val.conf && val.conf.items.map(item => item.id)
        if (couponIds.length) {
          this.getCouponsList(couponIds)
        }
        this.setData({
          couponIds: couponIds
        })
      }
    },
    tempData: {
      type: Object,
      observer (val) {
        // console.log(val, 'dataaaaa')
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    redlist: [],
    couponIds: []
  },

  /**
   * 组件的方法列表
   */
  methods: {
    getCouponsList (ids) {
      fecthCoponByIds({
        coupon_ids: ids,
        user_id: app.globalData.userInfo.user_id ? app.globalData.userInfo.user_id : null
      }).then(res => {
        let list = res.data && res.data.couponDtos ? res.data.couponDtos : []
        list = list.map(item => {
          item.bgImg = this.couponsBgImg(item.user_coupon_apply_status)
          return item
        })
        this.setData({
          redlist: list
        })
      }).catch(err => {
        wx.showToast({
          title: err && err.msg ? err.msg : '获取红包列表失败',
          icon: 'none'
        })
      })
    },
    getCoupon(e) {
      if (!isLogin()) {
        wx.navigateTo({
          url: '/pages/loginType/loginType',
        })
        return
      }
      // 领取红包
      let coupons = e.currentTarget.dataset.coupons.id
      let ids = []
      ids.push(coupons)
      this.getCouponApi(ids)
    },
    getCouponApi(couponIds = []) {
      fecthGetCoupons({
        couponIds: couponIds,
        userId: app.globalData.userInfo.user_id
      }).then(res => {
        this.getCouponsList(this.data.couponIds)
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
    },
    couponsBgImg(status) {
      let style = 1
      switch (this.data.item && +this.data.item.style) {
        case 1:
          style = 1     // 未领
          break
        case 2:
          style = 2    // 已领取
          break
        case 3:
          style = 3       // 已领完
          break
      }
      let imgSrc = ''
      switch (+status) {
        case 1: 
          imgSrc = '/assets/imgs/rednoget' + style + '.png'      // 未领
          break
        case 2:
          imgSrc = '/assets/imgs/redhasget' + style + '.png'     // 已领取
          break
        case 3: 
          imgSrc = '/assets/imgs/redout' + style + '.png'        // 已领完
          break
      }
      return imgSrc
    }
  }
})
