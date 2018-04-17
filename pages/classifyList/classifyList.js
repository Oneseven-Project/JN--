// pages/classifyList/classifyList.js
import { fectclassifyList } from '../../api/index.js'
const env = require('../../config/index.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    toastText: '',
    toView: '',
    activatedIdx: 0,
    listTabs: [],
    goodlist: [],
    catId: '',
    parId: '',
    page: 0,
    isError: false,
    noMore: false
  },
  tabClick(event) {
    this.setData({
      activatedIdx: event.currentTarget.dataset.index,
      toView: event.currentTarget.id,
      catId: event.currentTarget.dataset.item.id,
      parId: event.currentTarget.dataset.item.parent_id,
      noMore: false,
      page: 0
    })
    this.getList(this.data.catId, this.data.parId)
  },
  findAcIdx (arr,id) {
    let idx = 0
    arr.forEach((item,index) => {
      if (item.id == id) {
        idx = index
      }
    })
    return idx
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      catId: options.id,
      parId: options.parentId,
      isError: false
    })
    this.getList(options.id, options.parentId)
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
    this.getList(this.data.catId, this.data.parId)
    this.setData({
      noMore: false,
      page: 0
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.listTabs.length > 0){
      if (!this.data.noMore){
        let page = +this.data.page + 1
        this.setData({
          page: page
        })
        this.getList(this.data.catId, this.data.parId, this.data.page)
      }
    }
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
  getList (catId,parId,page = 0) {
    fectclassifyList({
      cat_id: catId,
      parent_id: parId,
      page: page,
      size: 10
    }).then(res => {
      let goodlist = this.data.goodlist.concat(res.data.skus || [])
      if (res.data.skus && !res.data.skus.length) {
        this.setData({
          noMore: true
        })
      }
      if (page == 0){
        goodlist = [].concat(res.data.skus || [])
        if (goodlist.length == 0) {
          this.setData({
            isError: true
          })
        }

      }
      
      this.setData({
        listTabs: res.data.sub_categorys,
        goodlist: goodlist,
        activatedIdx: this.findAcIdx(res.data.sub_categorys, catId)
      })
      wx.stopPullDownRefresh()
    }).catch(err => {
      wx.stopPullDownRefresh()
      // err && err.msg ? this.toast(err && err.msg) : ''
      wx.showToast({
        title: err && err.msg ? err.msg : '获取列表失败',
        icon: 'none'
      })
    })
  }
})