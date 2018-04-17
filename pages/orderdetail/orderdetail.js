// pages/orderdetail/orderdetail.js
import { fecthOrderDetail, fecthOrderCancel, fecthBuyAgain, fecthPayAgain, fecthSignfor } from "../../api/index.js"
import {
  getTime
} from "../../utils/index.js"
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderInfo: {},
    orderDes: '',
    toastText: '',
    orderSn: '',
    modelOption: {
      title: '',
      list: [],
      btn1: '知道了',
      btn2: '',
      resp_type: 0,
      cartId: [],
      resp_type: 2
    },
    orderStatusImg: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.sn) {
      this.setData({
        orderSn: options.sn
      })
      this.getorder(options.sn)
    }
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
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  toast(text) {
    let t = this.selectComponent('.toast')
    this.setData({
      toastText: text
    })
    t && t.show()
  },
  showmodel() {
    let m = this.selectComponent('.jn-model') || null
    m && m.show()
  },
  modelAction(obj) {
    this.setData({
      modelOption: { ...obj }
    })
    this.showmodel()
  },
  getorder (sn) {
    fecthOrderDetail({
      order_sn: sn
    }).then(res => {
      if (res.data && res.data.cancel_time){
        res.data.cancel_time = res.data.cancel_time.substring(10)
      }
      this.setData({
        orderInfo: res.data
      })
      this.getOrdersDes(+res.data.order_status)
    }).catch(err => {
      // console.log(err)
      wx.showToast({
        title: err && err.msg ? err.msg : '获取信息失败',
        icon: 'none'
      })
    })
  },
  getOrdersDes (status) {
    let str = ""
    let imgSrc = ""
    switch(status) {
      case 10:
        str = ""
        imgSrc = "../../assets/imgs/waitpay.png"
        break
      case 30:
        str = "商品正在出库，请稍后"
        imgSrc = "../../assets/imgs/waitsend.png"
        break
      case 40:
        str = "商品在路上了,请稍后"
        imgSrc = "../../assets/imgs/waitsign.png"
        break
      case 70:
        str = "商品已做拒收处理,正在处理退款"
        imgSrc = "../../assets/imgs/reject.png"
        break
      case 60:
        str = "感谢你对江楠生鲜的支持，期待您再次光临"
        imgSrc = "../../assets/imgs/finished.png"
        break
      case 50:
        str = "订单已取消，正在处理退款"
        imgSrc = "../../assets/imgs/canceled.png"
        break
    }
    this.setData({
      orderDes: str,
      orderStatusImg: imgSrc
    })
  },
  buyAgain () {
    // 再次购买
    let arr = this.data.orderInfo.goods.map(item => {
      return {
        quantity: 1,
        skuId: item.sku_id
      }
    })
    fecthBuyAgain({
      items: arr,
      user_id: app.globalData.userInfo.user_id
    }).then(res => {
      let goodList = []
      goodList = res.data.filter(item => item.error).map(item => item.item)
      if (goodList.length > 0){
        this.modelAction({
          title: '以下商品售罄',
          btn1: '知道了',
          list: goodList,
          btn2: '回首页逛逛',
          resp_type: 2
        })
      } else {
        wx.switchTab({
          url: '/pages/cart/cart',
        })
      }
    }).catch(err => {
      // err && err.msg ? this.toast(err.msg) : this.toast('请求错误')
      wx.showToast({
        title: err && err.msg ? err.msg : '获取信息失败',
        icon: 'none'
      })
    })
  },
  toPay () {
    fecthPayAgain({
      orderSns: [this.data.orderInfo.order_sn],
      userId: app.globalData.userInfo.user_id
    }).then(res => {
      if (res.data.code == 'SUCCESS') {
        let obj = res.data.extMap
        wx.requestPayment({
          timeStamp: obj.timeStamp,
          nonceStr: obj.nonceStr,
          package: obj.package,
          signType: obj.signType,
          paySign: obj.paySign,
          success(res) {
            wx.redirectTo({
              url: '/pages/orders/orders?index=' + 1,
            })
          },
          fail(err) {
            console.log(err, '失败')
          },
          complete() {
          }
        })
      } else {
        wx.showModal({
          title: '发起支付失败',
          content: res.data.msg
        })
      }
    }).catch(err => {
      // err && err.msg ? this.toast(err.msg) : this.toast('支付请求失败')
      wx.showToast({
        title: err && err.msg ? err.msg : '支付请求失败',
        icon: 'none'
      })
    })
  },
  cancleOrder () {
    fecthOrderCancel({
      order_sn: this.data.orderInfo.order_sn
    }).then(res => {
      // this.toast('取消订单成功！')
      wx.showToast({
        title: err && err.msg ? err.msg : '取消订单成功！',
        icon: 'none'
      })
      wx.navigateTo({
        url: '/pages/orders/orders?index=' + 3,
      })
    }).catch(err => {
      // err && err.msg ? this.toast(err.msg) : this.toast('取消订单失败！')
      wx.showToast({
        title: err && err.msg ? err.msg : '取消订单失败！',
        icon: 'none'
      })
    })
  },
  signFor () {
    // 签收
    fecthSignfor({
      order_sn: this.data.orderInfo.order_sn
    }).then(res => {
      wx.showToast({
        title: '签收订单成功！',
        icon: 'none'
      })
      this.getorder(this.data.orderInfo.order_sn)
    }).catch(err => {
      wx.showToast({
        title: err && err.msg ? err.msg : '签收订单失败！',
        icon: 'none'
      })
    })
  },
  toDetail (e) {
    let skuId = e.currentTarget.dataset.item.sku_id
    let spuId = e.currentTarget.dataset.item.spu_id
    wx.navigateTo({
      url: '/pages/goods/goods?skuId=' + skuId + '&spuId=' + spuId,
    })
  },
  timeOut () {
    this.getorder(this.data.orderSn)
  }
})