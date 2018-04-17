// pages/cityChoose/cityChoose.js
import { getLocation, fecthCityList, fecthAdressCode } from '../../api/index.js'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    toastText: '',
    shipping: [],
    currentCity: '',
    adsInfo: {},
    hadCitys: [],
    failCity: false,
    loading: false
  },
  getLocation () {
    this.setData({
      loading: true
    })
    getLocation().then(res => {
      this.setData({
        failCity: false,
        loading: false,
        currentCity: res.name,
        adsInfo: res
      })
    }).catch(err => {
      wx.showToast({
        title: err && err.msg ? err.msg : '定位失败',
        icon: 'none'
      })
      // this.toast("定位失败")
    })
  },
  relocation () {
    this.setData({
      currentCity: ''
    })
    this.getLocation()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      failCity: false,
      loading: false,
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
    this.getLocation()
    fecthCityList().then(res => {
      this.setData({
        hadCitys: res.data && res.data.areas && res.data.areas.length > 0 ? res.data.areas : [],
        shipping: res.data && res.data.userAddressList && res.data.userAddressList.length > 0 ? res.data.userAddressList : [],
      })
    }).catch(err => {
      // this.toast("获取城市列表失败")
      wx.showToast({
        title: err && err.msg ? err.msg : '获取城市列表失败',
        icon: 'none'
      })
    })
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
  chooseCity (e) {
    let city = e.target.dataset.item && e.target.dataset.item.city_id || ''
    let province = e.target.dataset.item && e.target.dataset.item.province_id || ''
    let street = e.target.dataset.item && e.target.dataset.item.street_id || ''
    let district = e.target.dataset.item && e.target.dataset.item.district_id || ''
    app.globalData.location = {
      name: e.target.dataset.item.city_name,
      province: province,
      city: city,
      district: district,
      street: street
    }
    app.globalData.isChangeCity = true
    wx.navigateBack({})
  },
  chooseAddress (e) {
    let item = e.currentTarget.dataset.item && e.currentTarget.dataset.item
    let city = item.city
    let province = item.province
    let street = item.street
    let district = item.district
    app.globalData.location = {
      name: item.full_addr,
      province: province,
      city: city,
      district: district,
      street: street
    }
    app.globalData.isChangeCity = true
    wx.navigateBack({})
  },
  reCurrentCity () {
    let res = this.data.adsInfo
    console.log(res, '地址')
    fecthAdressCode({
      province: res.regeocodeData.addressComponent.province,
      city: res.regeocodeData.addressComponent.city,
      district: res.regeocodeData.addressComponent.district,
      street: res.regeocodeData.addressComponent.township
    }).then(data => {
      app.globalData.location = {
        name: res.name,
        province: data.data && data.data.province_id || data.data.province_id != 0 ? data.data.province_id : "104104",
        city: data.data && data.data.city_id || data.data.city_id != 0 ? data.data.city_id : '104104101',
        district: data.data && data.data.district_id || data.data.district_id != 0 ? data.data.district_id : "",
        street: data.data && data.data.street_id || data.data.street_id != 0 ? data.data.street_id : ""
      }
      app.globalData.isChangeCity = true
      wx.switchTab({
        url: '/pages/index/index'
      })
    }).catch(errs => {
      console.log(errs)
      // this.toast("获取地址失败")
      wx.showToast({
        title: err && err.msg ? err.msg : '获取地址失败',
        icon: 'none'
      })
    })
    
  },
  toast(text) {
    let t = this.selectComponent('.toast')
    this.setData({
      toastText: text
    })
    t && t.show()
  }
})