// pages/address/address.js
import {
  fecthAddressList,
  fecthAddressUpdate,
  fecthAddressDelete
 } from "../../api/index.js"
const qs = require('../../assets/js/qs.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: '',
    addressList: [],
    toastText: ''
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
    this.getList()
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
  setDefault (e) {
    let info = e.currentTarget.dataset.item
    fecthAddressUpdate({
      ...info,
      "is_default": true,
    }).then(res => {
      this.getList()
    }).catch(err => {
      // err && err.msg ? this.toast(err.msg) : this.toast('设置失败')
      wx.showToast({
        title: err && err.msg ? err.msg : '设置失败',
        icon: 'none'
      })
    })
  },
  getList () {
    fecthAddressList({
      token: wx.getStorageSync('token') || null
    }).then(res => {
      this.setData({
        addressList: res.data.shippingAddresssDTOs
      })
    }).catch(err => {
      // err && err.msg ? this.toast(err.msg) : this.toast('获取数据失败')
      wx.showToast({
        title: err && err.msg ? err.msg : '获取数据失败',
        icon: 'none'
      })
    })
  },
  delAdress (e) {
    let info = e.currentTarget.dataset.item
    fecthAddressDelete({
      ...info
    }).then(res => {
      this.toast("删除收货地址成功")
      this.getList()
    }).catch(err => {
      // err && err.msg ? this.toast(err.msg) : this.toast('获取数据失败')
      wx.showToast({
        title: err && err.msg ? err.msg : '获取数据失败',
        icon: 'none'
      })
    })
  },
  chooseAddress (e) {
    // 选择地址
    let address = e.currentTarget.dataset.item 
    if (app.globalData.isFromPay) {
      app.globalData.orderAdress = address
      wx.navigateBack({})
    }
  },
  toAdressAdd (e) {
    let info = e.currentTarget.dataset.item || null
    if (info) {
      // 修改地址
      wx.navigateTo({
        url: '/pages/address_add/address_add?' + qs.stringify(info, { arrayFormat: 'repeat' }),
      })
    } else {
      // 添加地址
      wx.navigateTo({
        url: '/pages/address_add/address_add',
      })
    }
  }
})