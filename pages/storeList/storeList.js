// pages/storeList/storeList.js
import { fecthStoreList } from '../../api/index.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    toastText: '',
    goodlist: [],
    storeInfo: {},
    isError: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let t = this.selectComponent('.toast')
    if (t) {
      t.changeStatus()
    }
    this.getStoreList(options.seller_id)
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
    this.setData({
      isError: false
    })
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
  getStoreList (id = '') {
    fecthStoreList({
      seller_id: id
    }).then(res => {
      let category = res.data && res.data.category || []
      let skus = category.map(item => {
        return item.skus && item.skus.filter(sku => {
          return sku.sku_id != ''
        })
      })
      skus = Array.prototype.concat.apply([], skus)
      if (skus.length == 0) {
        this.setData({
          isError: true
        })
      }
      this.setData({
        storeInfo: res.data,
        goodlist: skus
      })
    }).catch(err => {
      // err && err.msg ? this.toast(err && err.msg) : ''
      wx.showToast({
        title: err && err.msg ? err.msg: '获取数据失败',
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