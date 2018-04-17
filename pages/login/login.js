// pages/login/login.js
import {
  featcode,
  login,
  featUserInfo
} from '../../api/index.js'
const app = getApp()
let iniTime = 60
let countDown = null

Page({
  /**
   * 页面的初始数据
   */
  data: {
    codeText: '获取验证码',
    disTap: false,
    phoneNum: null,
    code: null,
    verificationCode: null,
    toastText: ''
  },
  toast(text) {
    let t = this.selectComponent('.toast')
    this.setData({
      toastText: text
    })
    t && t.show()
  },
  count () {
    iniTime--
    this.setData({
      disTap: true,
      codeText: iniTime + 's'
    })
    if (iniTime == 0) {
      clearInterval(countDown)
      iniTime = 60
      this.setData({
        disTap: false,
        codeText: '获取验证码'
      })
    }
  },
  getCode () {
    // featUserInfo().then(res => {
    //   console.log(res)
    // }).catch(err => {
    //   console.log(err)
    // })

    if (!this.data.phoneNum) {
      // this.toast('请先输入手机号码')
      wx.showToast({
        title: '请先输入手机号码',
        icon: 'none'
      })
      return
    } else if (this.data.phoneNum.length != 11){
      // this.toast('请填写正确手机号码')
      wx.showToast({
        title: '请填写正确手机号码',
        icon: 'none'
      })
      return
    }

    this.count()
    countDown = setInterval(() => {
      this.count()
    }, 1000)
    featcode({
      phone: this.data.phoneNum
    }).then(res3 => {

    }).catch(err => {
      iniTime = 60
      clearInterval(countDown)
      this.setData({
        disTap: false,
        codeText: '获取验证码'
      })
      // this.toast(err && err.msg || '获取验证码失败')
      wx.showToast({
        title: err && err.msg ? err.msg : '获取验证码失败',
        icon: 'none'
      })
      
    })
  },
  bindPhoneNum: function(res) {
    this.setData({
      phoneNum: res.detail.value
    })
  },
  bindCode: function (res){
    this.setData({
      code: res.detail.value
    })
  },
  tapLogin () {
    // 点击登录
    if (!this.data.phoneNum) {
      // this.toast('请先输入手机号码')
      wx.showToast({
        title: '请先输入手机号码',
        icon: 'none'
      })
      return
    } else if (this.data.phoneNum.length != 11) {
      // this.toast('请输入正确的手机号码')
      wx.showToast({
        title: '请输入正确的手机号码',
        icon: 'none'
      })
      return
    }
    if (!this.data.code) {
      // this.toast('请输入验证码')
      wx.showToast({
        title: '请输入验证码',
        icon: 'none'
      })
      return
    }
    if (this.data.code.length != 6) {
      // this.toast('请先输入正确的验证码')
      wx.showToast({
        title: '请先输入正确的验证码',
        icon: 'none'
      })
      return
    }
    let nikeName = wx.getStorageSync('nickName') || null
    let man = {}
    if (nikeName) {
      man = {
        nickName: nikeName.nickName,
        headPortrait: nikeName.headPortrait
      }
    }
    wx.showLoading({
      title: '登录中...',
    })
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        app.globalData.wxcode = res.code
        login({
          ...man,
          jsCode: app.globalData.wxcode,
          "phone": this.data.phoneNum,
          "verificationCode": this.data.code,
        }).then(res => {
          app.globalData.userInfo = res.data.usersDTOs[0]
          wx.setStorageSync('token', res.token)
          wx.hideLoading()
          setTimeout(function () {
            wx.switchTab({
              url: '/pages/my/my'
            })
          }, 500)
        }).catch(err => {
          wx.hideLoading()
          // this.toast(err && err.msg || '登录失败')
          wx.showToast({
            title: err && err.msg ? err.msg : '请先输入正确的验证码',
            icon: 'none'
          })
        })
      }
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
    // this.toast('初次渲染完成')
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // this.toast('监听页面显示')
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
    clearInterval(countDown)
    // wx.removeStorageSync('nickName')
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
  
  }
})