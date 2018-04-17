import { fecthTotalAmt } from "../../api/index.js"

// pages/redpacket/redpacket.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    redList: [],
    redBgImg: '../../assets/imgs/redCanUse.png',
    noList: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let coupons =JSON.parse(wx.getStorageSync('coupons')) || []
    this.setData({
      redList: coupons
    })
    let couponIds = []
    coupons.map(item => {
      if (item.isSelected) {
        couponIds.push(item)
      }
    })
    wx.setStorageSync('selectCoupon', JSON.stringify(couponIds))
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
  tabClick(e) {
    let index = e.currentTarget.dataset.index
    let imgSrc = ''
    switch (index) {
      case 0:
        imgSrc = '../../assets/imgs/redCanUse.png'
        break
      case 1:
        imgSrc = '../../assets/imgs/redDone.png'
        break
      case 2:
        imgSrc = '../../assets/imgs/redout.png'
        break

    }
    this.setData({
      activatIndex: index,
      redBgImg: imgSrc
    })
  },
  toRedRule() {
    wx.navigateTo({
      url: '/pages/redRule/redRule',
    })
  },
  toHome () {
    wx.switchTab({
      url: '/pages/index/index',
    })
  },
  checkCoupon (e) {
    // 选择红包
    let coupon = e.currentTarget.dataset.coupon
    let couponIds = []
    let list = this.data.redList.map(item => {
      if (item.id == coupon.id) {
        item.isSelected = !coupon.isSelected
      } else {
        item.isSelected = false
      }
      return item
    })
    if (!coupon.isSelected) {
      couponIds.push(coupon)
    }
    wx.setStorageSync('selectCoupon', JSON.stringify(couponIds))
    this.setData({
      redList: list
    })
    wx.navigateBack({})    
  }
})