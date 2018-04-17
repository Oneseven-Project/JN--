// pages/loginType/loginType.js
const app = getApp()
import {
  login
} from '../../api/index.js'

Page({
  data: {
    toastText: '',
    nickName: "",
    headPortrait: "",
    isGetUser: false
  },
  toLogin () {
    wx.navigateTo({
      url: '../login/login'
    })
  },
  goTerms () {
    wx.navigateTo({
      url: '/pages/terms/terms',
    })
  },
  getPhoneNumber (res) {
    var token = wx.getStorageSync('token') || null
    if (token) {
      wx.navigateBack({})
      return
    }
    let self = this
    if (res.detail && res.detail.encryptedData) {
      // 获得加密的信息
      let data = {
        "encryptedData": res.detail.encryptedData,
        "jsCode": app.globalData.wxcode,
        "iv": res.detail.iv,
        nickName: self.data.nickName,
        headPortrait: self.data.headPortrait
      }
      wx.showLoading({title: ''})
      login(data).then(res2 => {
        wx.hideLoading()
        self.setData({
          userInfo: res2.data.usersDTOs[0]
        })
        app.globalData.userInfo = res2.data.usersDTOs[0]
        wx.setStorageSync('token', res2.token)
        if (app.globalData.isFromCart) {
          app.globalData.isFromCart = false
          wx.switchTab({
            url: '/pages/cart/cart',
          })
        } else {
          wx.navigateBack({})
        }      
      }).catch(err => {
        wx.login({
          success: res => {
            // 发送 res.code 到后台换取 openId, sessionKey, unionId
            app.globalData.wxcode = res.code
            self.getUser()
          }
        })
        wx.hideLoading()
        wx.showModal({
          title: '登录失败',
          content: err && err.msg ? err.msg : '登录发生错误',
        })
      })
    } else {
      // 跳转到登录
      wx.navigateTo({
        url: '../login/login'
      })
    }
  },
  onShow: function () {
    var token = wx.getStorageSync('token') || null
    if (token) {
      wx.navigateBack({})
      return
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.getNetworkType({
      success: function(res) {
        if (res.networkType == 'none') {
          wx.showModal({
            title: '当前无网络',
            content: '您的设备当前处于无网络状态，请先检查您的网络',
          })
          return
        }
      },
    })

    var token = wx.getStorageSync('token') || null
    if (token) {
      wx.navigateBack({})
      return
    }
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        app.globalData.wxcode = res.code
        this.getUser()
      }
    })
  },
  onUnload: function () {
    wx.hideLoading()
  },
  getUser () {
    let _this = this
    wx.getUserInfo({
      success: function (res) {
        _this.setData({
          isGetUser: true,
          nickName: res.userInfo.nickName,
          headPortrait: res.userInfo.avatarUrl
        })
        let aObj = {
          nickName: res.userInfo.nickName,
          headPortrait: res.userInfo.avatarUrl
        }
        wx.setStorageSync('nickName', aObj)
      },
      fail: err => {
        // 失败则打开设置让其授权
        wx.showModal({
          title: '',
          content: '江楠生鲜需要您的授权才能正常使用该功能',
          cancelText: '取消',
          confirmText: '确定',
          success: function (res) {
            if (res.confirm) {
              wx.openSetting({
                success(data){
                  if(data){
                    if (data.authSetting["scope.userInfo"] == true) {
                      console.log(data, '获得授权了')
                      wx.getUserInfo({
                        success (res2) {
                          console.log(res2,'res2')
                          _this.setData({
                            isGetUser: true,
                            nickName: res2.userInfo.nickName,
                            headPortrait: res2.userInfo.avatarUrl
                          })
                          let aObj = {
                            nickName: res2.userInfo.nickName,
                            headPortrait: res2.userInfo.avatarUrl
                          }
                          wx.setStorageSync('nickName', aObj)
                        }
                      })
                    }
                  }
                },
                fail (er) {
                  _this.setData({
                    isGetUser: false,
                  })
                }
              })
            } else if (res.cancel) {
              _this.setData({
                isGetUser: false,
              })
              wx.navigateBack()
            }
          }
        })
      }
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