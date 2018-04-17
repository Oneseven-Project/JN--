// pages/custom/custom.js
import {
  fetchTemplate,
  fetchTemplateData,
  getLocation,
  fetchHomeTemplate,
  fetchHomeData,
  fecthGetAd
} from '../../api/index.js'

const app = getApp()
let timer = null

Page({
  /**
   * 页面的初始数据
   */
  data: {
    toastText: '',
    location: '',
    moduleItem: {},
    templateId: '',
    templateConf: {},
    templateData: {},
    adItem: {},
    adImg: '',
    isShow: false
  },
  reLocation () {
    wx.navigateTo({
      url: '/pages/cityChoose/cityChoose'
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

    if (app.globalData.isChangeCity) {
      wx.pageScrollTo({
        scrollTop: 0,
      })
      app.globalData.isChangeCity = false
    }
    this.getHomeCof()
    this.getAd()
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
    if (this.data.moduleItem.type == 15) {
      app.globalData.topNavRefresh()
    } else {
      this.getHomeCof()
    }
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
  getHomeCof () {
    fetchHomeTemplate({}).then(res => {
      let data = res.data[0]
      this.setData({
        location: app.globalData && app.globalData.location && app.globalData.location.name,
        moduleItem: data,
        templateId: data && data.id,
        templateConf: data && data.config && JSON.parse(data.config)
      })
      this.getHomeData(data.id)
      wx.stopPullDownRefresh()
    }).catch(err => {
      wx.stopPullDownRefresh()
      wx.showToast({
        title: err && err.msg ? err.msg : '获取首页模板失败',
        icon: 'none'
      })
    })
  },
  getHomeData (id) {
    fetchHomeData({
      template_id: id || this.data.templateId
    }).then(res => {
      let data = res.data
      this.setData({
        templateData: data
      })
    }).catch(err => {
      // err && err.msg ? this.toast(err && err.msg) : ''
      wx.showToast({
        title: err && err.msg ? err.msg : '获取首页数据失败',
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
  },
  getAd () {
    fecthGetAd({
      sid: 2
    }).then(res => {
      let storeAd = wx.getStorageSync('alert-ad') ? JSON.parse(wx.getStorageSync('alert-ad')) : null
      let nowMonth = new Date().getMonth()
      let nowDay = new Date().getDate()
      if (!storeAd || storeAd.hash !== res.data.hash || !(storeAd.mounth === nowMonth && storeAd.day === nowDay)) {
        // 自然日弹窗一次，或者有新的弹窗才会弹
        let alertAd = {
          mounth: new Date().getMonth(),
          day: new Date().getDate(),
          hash: res.data.hash
        }
        wx.setStorageSync('alert-ad', JSON.stringify(alertAd))
        this.setData({
          adImg: res.data && res.data.conf && res.data.conf[0].filepath,
          adItem: res.data && res.data.conf[0],
          isShow: true
        })
        this.autoCloseAd(res.data.show_time)
      }
      
    }).catch(err => {
      wx.showToast({
        title: err && err.msg ? err.msg : '获取数据失败',
        icon: 'none'
      })
    })
  },
  autoCloseAd (time) {
    let _this = this
    timer = setTimeout(function(){
      _this.setData({
        isShow: false
      })
      clearTimeout('timer')
    }, time)
  },
  closeAd () {
    clearTimeout('timer')
    this.setData({
      isShow: false
    })
  },
  adClick () {
    let item = this.data.adItem
    if (!item.id) {
      return
    }
    if (item.type == 'template') {
      wx.navigateTo({
        url: '/pages/custom/custom?id=' + item.id,
      })
    } else if (item.type == 'goods') {
      wx.navigateTo({
        url: '/pages/goods/goods?skuId=' + item.id + '&spuId=' + item.spu_id,
      })
    } else if (item.type == 'category') {
      wx.navigateTo({
        url: '/pages/classifyList/classifyList?id=' + item.id + '&parentId=' + item.parent_id,
      })
    }
  }
})