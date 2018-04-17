// pages/custom/custom.js
import {
  fetchTemplate,
  fetchTemplateData
} from '../../api/index.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    toastText: '',
    templateId: '',
    templateConf: {},
    templateData: {}
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      templateId: options.id
    })
    this.fetchTemplate(this.data.templateId)
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
    this.fetchTemplate(91)
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
  fetchTemplate(id) {
    fetchTemplate({
      template_id: id || this.data.templateId
    }).then(res => {
      let data = res.data[0]
      this.setData({
        templateId: data && data.id,
        templateConf: data && data.config && JSON.parse(data.config)
      })
      this.fetchTemplateData(data.id)
      wx.stopPullDownRefresh()
    }).catch(err => {
      wx.stopPullDownRefresh()
      // err && err.msg ? this.toast(err && err.msg) : ''
      wx.showToast({
        title: err && err.msg ? err.msg : '获取模板失败',
        icon: 'none'
      })
    })
  },
  fetchTemplateData(id) {
    fetchTemplateData({
      template_id: id || this.data.templateId
    }).then(res => {
      let data = res.data
      this.setData({
        templateData: data
      })
    }).catch(err => {
      // err && err.msg ? this.toast(err && err.msg) : ''
      wx.showToast({
        title: err && err.msg ? err.msg : '获取数据失败',
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