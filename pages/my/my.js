// pages/my/my.js
const app = getApp()
import {
  fecthOrderlist,
  fecthGetAd
}  from '../../api/index.js'
import { isLogin } from '../../utils/index.js'

Page({
  data: {
    userInfo: null,
    toastText: '',
    countNum: 0,
    defaultImg: '../.../assets/imgs/Avatar.png',
    bannerItem: {},
    orders: [
      { name: '待付款', num: 0, icon: "../../assets/imgs/ToPay.png" },
      { name: '待发货', num: 0, icon: "../../assets/imgs/ToShip.png" },
      { name: '已发货', num: 0, icon: "../../assets/imgs/Shipped.png" },
      // { name: '全部订单', num: 0, icon: "../../assets/imgs/AllOrder.png" }
    ],
    servers: [
      {
        name: '红包',
        icon: "../../assets/imgs/LuckyMoney.png"
      },
      {
        name: '邀请有礼',
        icon: "../../assets/imgs/Gift.png"
      },
      {
        name: '地址',
        icon: "../../assets/imgs/MyLocat.png"
      },
      {
        name: '客服',
        icon: "../../assets/imgs/CS.png"
        
      }],
    servers2: [
      {
        name: '收藏',
        icon: "../../assets/imgs/Collection-g.png"
      },
      {
        name: '帮助',
        icon: "../../assets/imgs/Help-g.png"
      },
      {
        name: '意见反馈',
        icon: "../../assets/imgs/Feedback-g.png"
      },
      {
        name: '关于我们',
        icon: "../../assets/imgs/About-g.png"
      }
    ],
  },
  goLogin () {
    wx.navigateTo({
      url: '../loginType/loginType',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let t = this.selectComponent('.toast')
    t.changeStatus()

    this.setData({
      userInfo: app.globalData.userInfo
    })

    this.setData({
      countNum: 0,
      userInfo: app.globalData.userInfo
    })
    if (isLogin()) {
      this.getOrderNum()
    }
    this.getAd()
  },
  onHide: function () {
    this.setData({
      countNum: 0
    })
  },
  toast(text) {
    let t = this.selectComponent('.toast')
    this.setData({
      toastText: text
    })
    t && t.show()
  },
  toOrders (e) {
    if (!isLogin()) {
      wx.navigateTo({
        url: '/pages/loginType/loginType',
      })
      return
    }
    let idx = e.currentTarget.dataset.index
    wx.navigateTo({
      url: '/pages/orders/orders?index=' + idx,
    })
  },
  toServer (e) {
    if (!isLogin()) {
      wx.navigateTo({
        url: '/pages/loginType/loginType',
      })
      return
    }
    let idx = e.currentTarget.dataset.index
    if(idx == 0) {
      wx.navigateTo({
        url: '/pages/redpacket/redpacket'
      })
      return
    }
    if (idx == 3) {
      wx.makePhoneCall({
        phoneNumber: '4008848688',
      })
      return
    }
    if (idx == 2) {
      wx.navigateTo({
        url: '/pages/address/address'
      })
      return
    }
    if(idx == 1) {
      // this.toast('该服务暂未开通，敬请期待')
      wx.showToast({
        title: '该服务暂未开通，敬请期待',
        icon: 'none'
      })
    }
  },
  toServer2 (e) {
    let index = e.currentTarget.dataset.index
    if (index == 3) {
      this.setData({
        countNum: this.data.countNum + 1
      })
    }
    if (this.data.countNum == 6) {
      wx.removeStorageSync('token')
      app.globalData.userInfo = null
    }
    if (!isLogin()) {
      wx.navigateTo({
        url: '/pages/loginType/loginType',
      })
      return
    }
    // this.toast('该服务暂未开通，敬请期待')
    wx.showToast({
      title: '该服务暂未开通，敬请期待',
      icon: 'none'
    })
  },
  getOrderNum () {
    fecthOrderlist({
      user_id: app.globalData.userInfo.user_id
    }).then(res => {
      let waitPay = 0
      let watiSend = 0
      let hadSend = 0
      res.data && res.data.orders && res.data.orders.map(item => {
        if(item.order_status == 10){
          waitPay++
        } else if (item.order_status == 30) {
          watiSend++
        } else if (item.order_status == 40) {
          hadSend++
        }
      })
      let orders = this.data.orders.map((item, idx) => {
        if(idx == 0) {
          item.num = waitPay
        } else if (idx == 1){
          item.num = watiSend
        } else if (idx == 2){
          item.num = hadSend
        } else if (idx == 3){
          // item.num = res.data && res.data.total || 0
        }
        return item
      })
      this.setData({
        orders: orders
      })
    }).catch(err => {
      console.log(err)
      // err && err.msg ? this.toast(err.msg) : this.toast('请求发生错误')
      wx.showToast({
        title: err && err.msg ? err.msg : '请求发生错误',
        icon: 'none'
      })
    })
  },
  bindErrImg(e) {
    let userInfo = this.data.userInfo
    userInfo.head_portrait = '../../assets/imgs/Avatar.png'
    this.setData({
      userInfo: userInfo
    })
  },
  getAd () {
    fecthGetAd({
      sid: 1
    }).then(res => {
      let item = {
        col: 6,
        conf: {
          items: []
        }
      }
      let obj = {}
      item.conf.items = res.data && res.data.conf.map(item => {
        obj.pic = item.filepath
        return obj

      })
      this.setData({
        bannerItem: item
      })
    }).catch(err => {
      console.log(err)
    })
  }
})