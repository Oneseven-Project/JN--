//app.js
import {
  fectchUserByT,
  login,
  getLocation,
  fecthAdressCode
} from 'api/index.js'
const amap = require('/assets/map/amap-wx.js')

App({
  onLaunch: function (e) {
    this.globalData.scene = e.scene
    var token = wx.getStorageSync('token') || null

    wx.removeStorageSync('selectCoupon')
    this.globalData.isDefaultCart = false

    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        console.log(res, 'code')
        this.globalData.wxcode = res.code
        if (token) {
          fectchUserByT({
            token: token
          }).then(res2 => {
            this.globalData.userInfo = res2.data.usersDTOs[0]
          }).catch(err => {
            // token失效时候应清除token
            wx.removeStorageSync('token')
            wx.showToast({
              title: err && err.msg || '登录失败',
              icon:'none',
              duration: 2000
            })
          })
        }
      }
    })
  },
  onShow (e) {
    this.globalData.scene = e.scene
  },
  globalData: {
    userInfo: null,
    wxcode: '',
    location: null,
    topNavRefresh: null,
    isChangeCity: false,
    isOrderAddAress: false,
    isFromPay: false,
    isFromCart: false,
    isDefaultCart: false,
    orderAdress: null,
    scene: null
  }
})