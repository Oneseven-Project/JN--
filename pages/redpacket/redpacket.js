// pages/redpacket/redpacket.js
import { fecthCopon } from '../../api/index'
import { isLogin } from '../../utils/index.js'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabList: [{ name: '未使用' }, { name: '已使用' }, { name: '已过期' }],
    activatIndex: 0,
    redList: [],
    redBgImg: '../../assets/imgs/redCanUse.png',
    status: 5,  // 默认为红包未使用状态
    noList: true,
    page: 0,
    noMore: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // (5, "未使用")
    // (10, "已使用")
    // (15, "已过期")
    this.getList(5)
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
    this.setData({
      page: 0
    })
    this.getList(this.data.status, this.data.page)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.redList.length > 0) {
      if (!this.data.noMore) {
        let page = +this.data.page + 1
        this.setData({
          page: page
        })
        this.getList(this.data.status, this.data.page)
      }
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  tabClick (e) {
    let index = e.currentTarget.dataset.index
    let imgSrc = ''
    let status = 5
    switch (index) {
      case 0:
        imgSrc = '../../assets/imgs/redCanUse.png'
        status = 5
        break
      case 1:
        imgSrc = '../../assets/imgs/redDone.png'
        status = 10
        break
      case 2:
        imgSrc = '../../assets/imgs/redout.png'
        status = 15
        break

    }
    this.setData({
      activatIndex: index,
      redBgImg: imgSrc,
      status: status,
      page: 0
    })
    this.getList(this.data.status, this.data.page)
  },
  toRedRule () {
    wx.navigateTo({
      url: '/pages/redRule/redRule',
    })
  },
  toHome () {
    wx.switchTab({
      url: '/pages/index/index',
    })
  },
  getList (status = 5, page = 0) {
    fecthCopon({
      user_id: app.globalData.userInfo.user_id,
      status: status,
      page: page,
      size: 10
    }).then(res => {
      // let list = []
      // if (res.data && res.data.userCouponsDtos.length == 0) {
      //   this.setData({
      //     noMore: true
      //   })
      // } else {
      //   list = this.data.redList.concat(res.data && res.data.userCouponsDtos)
      // }

      // if (+page == 0) {
      //   list = [].concat(res.data && res.data.userCouponsDtos)
      // }
      // this.setData({
      //   redList: list
      // })
      // wx.stopPullDownRefresh()
      let list = this.data.redList.concat(res.data && res.data.userCouponsDtos)
      if (res.data && !res.data.userCouponsDtos.length) {
        this.setData({
          noMore: true
        })
      }
      if (+page == 0) {
        list = [].concat(res.data.userCouponsDtos)
      }

      this.setData({
        redList: list
      })
      wx.stopPullDownRefresh()
    }).catch(err => {
      wx.stopPullDownRefresh()
      console.log(res)
    })
  }
})