// pages/statement/statement.js
const qs = require('../../assets/js/qs.js')
import { fecthTotalAmt, fecthCart, fecthCheckout } from "../../api/index.js"

const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    toastText: '',
    cartItemtId: [],
    goodList:[],
    AddressInfo: null,
    payable_amt: 0,
    product_sa: 0,
    shipment_fee: 0,
    modelOption: {
      title: '',
      list: [],
      btn2: '',
      resp_type: 0,
      cartId: []
    },
    currentCoupons: 0,
    coupons: [],
    defaultCoupons: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let cartIds = []
    if (options) {
      for (var i in options) {
        cartIds.push(+options[i])
      }
      this.setData({
        cartItemtId: cartIds
      })
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
    this.getGoodList()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    wx.removeStorageSync('selectCoupon')
    app.globalData.isDefaultCart = false
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    app.globalData.orderAdress = null
    wx.removeStorageSync('selectCoupon')
    app.globalData.isDefaultCart = false
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
  chooseAdrees () {
    // 选择地址
    app.globalData.isFromPay = true
    app.globalData.isDefaultCart = false
    wx.navigateTo({
      url: '/pages/address/address',
    })
  },
  addAdrees () {
    // 新增地址
    app.globalData.isOrderAddAress = true
    app.globalData.isDefaultCart = false
    wx.navigateTo({
      url: '/pages/address_add/address_add',
    })
  },
  getListInfo(shipment = []) {
    let addresssInfo = {}
    let couponId = {}
    let selectCoupon = wx.getStorageSync('selectCoupon') ? JSON.parse(wx.getStorageSync('selectCoupon')) : null // 选择红包的列表

    if (app.globalData.orderAdress) {
      addresssInfo = { address_id: app.globalData.orderAdress.id }
    }

    if (selectCoupon && selectCoupon.length) {
      let arr = []
      arr.push(selectCoupon[0].id)
      couponId = {
        user_coupon_ids: arr
      }
    } else {
      if (app.globalData.isDefaultCart) {
        couponId = {
          user_coupon_ids: this.data.defaultCoupons
        }
      }
    }

    fecthTotalAmt({
      ...addresssInfo,
      shipment_type_dtos: shipment,
      user_id: app.globalData.userInfo.user_id,
      cat_item_ids: this.data.cartItemtId,
      is_default_calc_req: app.globalData.isDefaultCart ? true : false,
      type: 'PRE_CHECKOUT',
      ...couponId
    }).then(res => {
      // 优先选择本地储存的地址
      let address = null
      if(app.globalData.orderAdress){
        address = app.globalData.orderAdress
      } else {
        address = res.data.address_dto
      }
      
      let couponsObj = res.data.coupons.find(item => item.isSelected) || { couponAmt: 0}
      let defaultCoupon = res.data.coupons.find(item => item.isSelected)
      this.setData({
        defaultCoupons: defaultCoupon ? [defaultCoupon.id] : []
      })
      wx.setStorageSync('coupons', JSON.stringify(res.data.coupons))
      // currentCoupons
      this.setData({
        AddressInfo: address,
        payable_amt: res.data.payable_amt.toFixed(2),
        product_sa: res.data.product_sa.toFixed(2),
        shipment_fee: res.data.shipment_fee.toFixed(2),
        coupons: res.data && res.data.coupons ? res.data.coupons : [],
        currentCoupons: selectCoupon && selectCoupon.length ? selectCoupon[0] : couponsObj
      })
    }).catch(err => {
      // err && err.msg ? this.toast(err.msg) : this.toast('获取数据失败')
      wx.showToast({
        title: err && err.msg ? err.msg : '获取数据失败',
        icon: 'none'
      })
    })
  },
  getGoodList () {
    fecthCart({
      user_id: app.globalData.userInfo.user_id,
      cart_item_ids: this.data.cartItemtId
    }).then(res => {
      if (res.data.not_empty && res.data.seller_list.length > 0) {
        let list = res.data.seller_list.map(item => {
          item.isFastMail = true
          return item
        })
        this.setData({
          goodList: list
        })
      }
      let shipment = this.data.goodList.map(item => {
        let shipType = 0
        // 快递是2，自提是1
        if (item.isFastMail){
          shipType = 2
        } else {
          shipType = 1
        }
        return {
          seller_id: item.seller_id,
          shipment_type: shipType
        }
      })
      this.getListInfo(shipment)
    })
  },
  checkAndPay () {
    let fastMailNum = 0
    let shipment = this.data.goodList.map(item => {
      let shipType = 0
      // 快递是2，自提是1
      if (item.isFastMail) {
        shipType = 2
        fastMailNum++
      } else {
        shipType = 1
      }
      return {
        seller_id: item.seller_id,
        shipment_type: shipType
      }
    })
    if (fastMailNum > 0) {
      // 有选择了快递
      if (!this.data.AddressInfo.name) {
        // this.toast("请先选择地址")
        wx.showToast({
          title: '请先选择地址',
          icon: 'none',
        })
        return
      }
    }

    let coupon_ids = []
    let couponObj = {}
    if (this.data.currentCoupons && this.data.currentCoupons.id) {
      coupon_ids.push(this.data.currentCoupons.id)
    }
    if (coupon_ids.length > 0) {
      couponObj= {
        user_coupon_ids: coupon_ids
      }
    } else {
      couponObj = {}
    }

    fecthCheckout({
      address_id: this.data.AddressInfo.id,
      user_id: app.globalData.userInfo.user_id,
      cart_item_ids: this.data.cartItemtId,
      shipment_type_dtos: shipment,
      ...couponObj
    }).then(res => {
      switch (res.data.checkoutDto.resp_type) {
        case 1:
          // 吊起支付
          if (res.data.payResult.code == 'SUCCESS'){
            this.pay(res.data.payResult.extMap)
          } else {
            wx.showModal({
              title: '发起支付失败',
              content: res.data.payResult.msg,
              complete (){
                wx.redirectTo({
                  url: '/pages/orders/orders?index=' + 0,
                })
              }
            })
          }
          break
        case 2:
          // 全售罄
          this.modelAction({
            title: '商品全售罄',
            list: res.data && res.data.checkoutDto && res.data.checkoutDto.skus || [],
            btn2: '回首页逛逛',
            resp_type: 2
          })
          break
        case 3:
          // 部分商品售罄
          this.modelAction({
            title: '以下商品已售罄',
            list: res.data && res.data.checkoutDto && res.data.checkoutDto.skus || [],
            btn2: '移除无货商品',
            resp_type: 3
          })
          break
        case 4:
          // 商品库存不足
          this.modelAction({
            title: '以下商品库存不足',
            list: res.data && res.data.checkoutDto && res.data.checkoutDto.skus || [],
            btn2: '确定',
            resp_type: 4
          })
          break
        case 5:
          // 价格变动
          this.modelAction({
            title: '以下商品售价有变动',
            list: res.data && res.data.checkoutDto && res.data.checkoutDto.skus || [],
            btn2: '继续结算',
            resp_type: 5,
            cartId: cartIds
          })
          break
        case 6:
          // 红包比商品总价高，直接支付成功
          wx.showToast({
            title: '支付成功',
            icon: 'none'
          })
          wx.redirectTo({
            url: '/pages/orders/orders?index=' + 1,
          })
          break  
      }
    }).catch(err => {
      // err && err.msg ? this.toast(err.msg) : this.toast("请求发生错误，请重试")
      wx.showToast({
        title: err && err.msg ? err.msg : '请求发生错误，请重试',
        icon: 'none',
      })
    })
  },
  modelAction(obj) {
    this.setData({
      modelOption: { ...obj }
    })
    this.showmodel()
  },
  showmodel() {
    let m = this.selectComponent('.jn-model') || null
    m && m.show()
  },
  pay (obj) {
    wx.requestPayment({
      timeStamp: obj.timeStamp,
      nonceStr: obj.nonceStr,
      package: obj.package,
      signType: obj.signType,
      paySign: obj.paySign,
      success (res) {
        wx.redirectTo({
          url: '/pages/orders/orders?index=' + 1,
        })
      },
      fail(err){
        wx.redirectTo({
          url: '/pages/orders/orders?index=' + 0,
        })
      },
      complete(){
      }
    })
  },
  fastmail(e) {
    // 快递
    app.globalData.isDefaultCart = false

    let index = e.currentTarget.dataset.index
    let item = e.currentTarget.dataset.item
    let list = this.data.goodList
    list[index].isFastMail = !item.isFastMail
    this.setData({
      goodList: list
    })
    let shipment = this.data.goodList.map(item => {
      let shipType = 0
      // 快递是2，自提是1
      if (item.isFastMail) {
        shipType = 2
      } else {
        shipType = 1
      }
      return {
        seller_id: item.seller_id,
        shipment_type: shipType
      }
    })
    this.getListInfo(shipment)
  },
  chooseRedBag () {
    // 选择红包
    if (this.data.coupons.length > 0) {
      wx.navigateTo({
        url: '/pages/use_redpacket/use_redpacket'
      })
    }
  }
})