// pages/orders/orders.js
import { fecthOrderlist, fecthPayAgain, fecthSignfor } from "../../api/index.js"
import {
  getTime
} from "../../utils/index.js"
const app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    toastText: '',
    ordersTabs: [
      "全部",
      "待付款",
      "待发货",
      "已发货"
    ],
    activatedIndex: 0,
    page: 0,
    noMore: false,
    orderlist: [],
    tt: 1517297160000
  },
  testDate (date) {
    return true
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let idx = 0
    switch (+options.index) {
      case 0:
      // 待付款
        this.getOrderlist(0, 10)
        idx = 1
        break
      case 1:
      // 待发货
        this.getOrderlist(0, 30)
        idx = 2
        break
      case 2:
      // 已发货
        this.getOrderlist(0, 40)
        idx = 3
        break
      case 3:
      // 全部
        this.getOrderlist(0, -1)
        idx = 0
        break
    }
    this.setData({
      activatedIndex: idx
    })
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
    // let status = 0
    // switch (+this.data.activatedIndex) {
    //   case 0:
    //     // 全部
    //     status = -1
    //     break
    //   case 1:
    //     // 待付款
    //     status = 10
    //     break
    //   case 2:
    //     // 待发货
    //     status = 30
    //     break
    //   case 3:
    //     // 已发货
    //     status = 40
    //     break
    // }
    // this.setData({
    //   page: 0,
    //   noMore: false
    // })
    // this.getOrderlist(this.data.page, status)
    this.refresh()
  },
  refresh () {
    let status = 0
    switch (+this.data.activatedIndex) {
      case 0:
        // 全部
        status = -1
        break
      case 1:
        // 待付款
        status = 10
        break
      case 2:
        // 待发货
        status = 30
        break
      case 3:
        // 已发货
        status = 40
        break
    }
    this.setData({
      page: 0,
      noMore: false
    })
    this.getOrderlist(this.data.page, status)
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (!this.data.noMore) {
      let page = (this.data.page + 1)
      this.setData({
        page: page
      })
      let status = 0
      switch (+this.data.activatedIndex) {
        case 0:
          // 全部
          status = -1
          break
        case 1:
          // 待付款
          status = 10
          break
        case 2:
          // 待发货
          status = 30
          break
        case 3:
          // 已发货
          status = 40
          break
      }
      this.getOrderlist(this.data.page, status)
    }
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
  bindCheckbox (e) {
    let order = e.currentTarget.dataset.item
    let orderlist = this.data.orderlist
    orderlist = orderlist.map(item => {
      if (item.order_sn == order.order_sn) {
        item.is_select = !order.is_select
      }
      return item
    })
    this.setData({
      orderlist: orderlist
    })
  },
  tabClick (e) {
    let index = e.currentTarget.dataset.index
    let status = 0
    switch (index) {
      case 0:
        // 全部
        status = -1
        break
      case 1:
        // 待付款
        status = 10
        break
      case 2:
        // 待发货
        status = 30
        break
      case 3:
        // 已发货
        status = 40
        break
    }
    this.getOrderlist(0, status).then(res => {
      this.setData({
        activatedIndex: index,
        page: 0,
        noMore: false
      })
      wx.pageScrollTo({
        scrollTop: 0
      })
    }).catch(err => {
      // console.log(err)
      wx.showToast({
        title: err && err.msg ? err.msg : '获取订单数据失败',
        icon: 'none'
      })
    })
  },
  getOrderlist(page = 0, status, size = 10) {
    let params = {}
    if (status != -1) {
      params = {
        order_status: status
      }
    }
    return new Promise((resolve, reject) => {
      fecthOrderlist({
        ...params,
        page: page,
        size: size,
        user_id: app.globalData.userInfo.user_id
      }).then(res => {
        let orderlist = this.data.orderlist.concat(res.data && res.data.orders || [])
        if (!(res.data && res.data.orders)) {
          this.setData({
            noMore: true
          })
        }
        if (page == 0) {
          orderlist = [].concat(res.data && res.data.orders || [])
        }
        orderlist = orderlist.map(item => {
          if (item.order_status == 10) {
            if (new Date(getTime(item.cancel_time)) - new Date() > 0) {
              item.isTimeleft = true
            } else {
              item.isTimeleft = false
            }
            item.is_select = false
            item.cancel_time = getTime(item.cancel_time)
          }
          return item
        })
        this.setData({
          orderlist: orderlist
        })
        resolve(res)
        wx.stopPullDownRefresh()
      }).catch(err => {
        this.setData({
          page: 0
        })
        wx.stopPullDownRefresh()
        // err && err.msg ? this.toast(err.msg) : this.toast('获取订单数据失败')
        wx.showToast({
          title: err && err.msg ? err.msg : '获取订单数据失败',
          icon: 'none'
        })
      })
    })
  },
  payTogeter () {
    // 合并支付
    let snArr = this.data.orderlist.filter(item => {
      return item.is_select
    }).map(order => {
      return order.order_sn
    })
    if (snArr.length == 0) {
      // this.toast('请先选择要支付的订单')
      wx.showToast({
        title: '请先选择要支付的订单',
        icon: 'none'
      })
      return
    }
    this.toPay(snArr)
  },
  PayOrder (e) {
    console.log(e)
    let sn = e.currentTarget.dataset.order.order_sn
    let snArr = []
    snArr.push(sn)
    this.toPay(snArr)
  },
  toPay (orderSns = []) {
    let _this = this
    fecthPayAgain({
      orderSns: orderSns,
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
            _this.setData({
              activatedIndex: 0,
              page: 0,
              noMore: false
            })
            wx.pageScrollTo({
              scrollTop: 0
            })
            _this.getOrderlist(0, -1)
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
  signFor (e) {
    let sn = e.currentTarget.dataset.order.order_sn
    fecthSignfor({
      order_sn: sn
    }).then(res => {
      wx.showToast({
        title: '签收成功',
        icon: 'none'
      })
      this.refresh()
    }).catch(err => {
      wx.showToast({
        title: err && err.msg ? err.msg : '签收失败',
        icon: 'none'
      })
    })
  },
  toDetail (e) {
    let sn = e.currentTarget.dataset.item.order_sn
    wx.navigateTo({
      url: '/pages/orderdetail/orderdetail?sn=' + sn
    })
  },
  timeOut () {
    // 倒计时到时间了
    let status = 0
    switch (+this.data.activatedIndex) {
      case 0:
        // 全部
        status = -1
        break
      case 1:
        // 待付款
        status = 10
        break
      case 2:
        // 待发货
        status = 30
        break
      case 3:
        // 已发货
        status = 40
        break
    }
    this.setData({
      page: 0
    })
    this.getOrderlist(this.data.page, status)
  }
})