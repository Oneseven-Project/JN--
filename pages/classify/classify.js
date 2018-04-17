// pages/search/search.js
import { fetchClassify } from '../../api/index.js'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    toastText: '',
    activeIndex: 0,
    classifys: [],
    title: '',
    classifyItems: [],
    parent_id: ''
  },
  chooseClasify (event) {
    // 左侧选择
    let idx = +event.currentTarget.dataset.index
    let item = event.currentTarget.dataset.item
    this.getCLassList(item.id).then(res => {
      this.setData({
        classifyItems: res.data,
        title: this.data.classifys[idx].label,
        activeIndex: idx,
        parent_id: item.id
      })
    }).catch(err => {
      // err && err.msg ? this.toast(err && err.msg) : ''
      wx.showToast({
        title: err && err.msg ? err.msg : '该分类获取失败',
        icon: 'none'
      })
    })
  },
  seeMore () {
    console.log(this.data.classifyItems[0].id, this.data.parent_id)
    wx.navigateTo({
      url: '/pages/classifyList/classifyList?id=' + this.data.classifyItems[0].id + '&parentId=' + this.data.parent_id,
    })
  },
  toClassList (event) {
    // 点击当前的
    let id = event.currentTarget.dataset.item && event.currentTarget.dataset.item.id || ''
    let par_id = event.currentTarget.dataset.item && event.currentTarget.dataset.item.parent_id || ''
    wx.navigateTo({
      url: '/pages/classifyList/classifyList?id=' + id + '&parentId=' + par_id,
    })
  },
  getCLassList (id) {
    return fetchClassify({
      channel_id: 1,
      cat_id: id
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
    
    let index = this.data.activeIndex
    this.getCLassList('').then(res => {
      this.setData({
        classifys: res.data,
        parent_id: this.data.parent_id ? this.data.parent_id : res.data[0].id
      })
      this.getCLassList(res.data[index].id).then(res2 => {
        this.setData({
          classifyItems: res2.data,
          title: res.data[index].label
        })
      }).catch(err => {
        wx.showToast({
          title: err && err.msg ? err.msg : '',
          icon: 'none'
        })
        // err && err.msg ? this.toast(err && err.msg) : ''
      })
    }).catch(err => {
      wx.showToast({
        title: err && err.msg ? err.msg : '',
        icon: 'none'
      })
      // err && err.msg ? this.toast(err && err.msg) : ''
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
  bindErrImg(e) {
    let index = e.target.dataset.imgindex
    this.data.classifyItems[index].logo = "../../assets/imgs/fruit.jpg"
    this.setData({
      classifyItems: [].concat(this.data.classifyItems)
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