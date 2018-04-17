// pages/goods/goods.js
import {
  fectGoodDetail,
  fectGoodInfo,
  fecthCartAdd,
  fecthCartSize
} from '../../api/index.js'
import { isLogin } from '../../utils/index.js'
const richText = require('../../json/testRichText.js')

const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    toastText: '',
    goodInfo: {},
    activeIdx: -1,
    skuName: '',
    spuId: '',
    skuId: '',
    cartNum: 0,
    currentIndex:1,
    isError: false,
    adev: ["每日精选", "品质保证", "优先送达","69元免邮"],
    showBack: false
  },
  chooseSku (e) {
    fectGoodInfo({
      spuId: this.data.spuId,
      skuId: e.currentTarget.dataset.sku.skuId
    }).then(res => {
      let skuidx = e.currentTarget.dataset.skuidx
      if (res.data.is_on_sale) {
        // 在售
        if (res.data.sku_stock && res.data.sku_stock > 0) {
          this.setData({
            goodInfo: res.data,
            activeIdx: skuidx,
            skuId: e.currentTarget.dataset.sku.skuId,
            skuName: res.data.skus[skuidx].name
          })
        } else {
          // this.toast('该商品已售罄')
          wx.showToast({
            title: '该商品已售罄',
            icon: 'none'
          })
        }
        // 库存不足
      } else {
        // this.toast('该商品已下架')
        wx.showToast({
          title: '该商品已下架',
          icon: 'none'
        })
      }
      
    }).catch(err => {
      // err && err.msg ? this.toast(err && err.msg) : ''
      wx.showToast({
        title: err && err.msg ? err.msg : '水果去旅行啦~',
        icon: 'none'
      })
    })
  },
  bindErrImg(e) {
    this.data.goodInfo['presenter_img'] = "../../assets/imgs/fruit.jpg"
    this.setData({
      goodInfo: { ...this.data.goodInfo}
    })
  },
  imgErr (e) {
    // 详情描述的图片错误时候
    let index = e.target.dataset.index
    this.data.goodInfo.sku_desc_imgs[index] = "../../assets/imgs/fruit.jpg"
    this.setData({
      goodInfo: this.data.goodInfo
    })
  },
  pointChange (e) {
    let index = e.detail.current
    this.setData({
      currentIndex: index + 1
    })
  },
  swiperErr (e) {
    let index = e.target.dataset.index
    this.data.goodInfo.images[index] = "../../assets/imgs/fruit.jpg"
    this.setData({
      goodInfo: this.data.goodInfo
    })
  },
  findActive (arr,id) {
    let idx = -1
    arr.forEach((item, index) => {
      if (item.skuId == +id) {
        this.setData({
          skuName: item.name
        })
        if (this.data.goodInfo.is_on_sale) {
          if (this.data.goodInfo.sku_stock && this.data.goodInfo.sku_stock > 0) {
            idx = index
          }
        }
      }
    })
    return idx
  },
  cartAdd(e) {
    let good = e.currentTarget.dataset.item
    if (this.data.goodInfo.sku_stock == 0) {
      return
    }
    if (!isLogin()) {
      wx.navigateTo({
        url: '/pages/loginType/loginType',
      })
      return
    }
    fecthCartAdd({
      items: [{
        quantity: 1,
        skuId: this.data.skuId,
      }
      ],
      user_id: app.globalData.userInfo.user_id
    }).then(res => {
      if (res.data && res.data.error) {
        this.toast(res.data.error.message)
      } else {
        // this.toast("加入购物车成功")
        wx.showToast({
          title: '加入购车成功',
          icon: 'none'
        })
        this.getCartNum()
      }
    }).catch(err => {
      // err.msg ? this.toast(err.msg) : this.toast("加入购物车失败")
      wx.showToast({
        title: err && err.msg ? err.msg : '加入购物车失败',
        icon: 'none'
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 先获取场景值
    let _this = this
    let scene = app.globalData.scene
    _this.setData({
      scene: scene
    })
    if (getCurrentPages().length == 1) {
      if (scene == 1007 || scene == 1008) {
        // 从分享打开的小程序
        _this.setData({
          showBack: true
        })
      }
    }

    this.setData({
      spuId: options && options.spuId ? options.spuId : -1,
      skuId: options && options.skuId ? options.skuId : -1,
      tt: richText
    })
    fectGoodInfo({
      spuId: this.data.spuId,
      skuId: this.data.skuId
    }).then(res => {
      if (res.data && res.data.skus && res.data.skus.length > 0){
        this.setData({
          goodInfo: res.data
        })
        console.log(this.data.goodInfo, 'goodInfo')
        this.setData({
          activeIdx: this.findActive(res.data.skus, this.data.skuId)
        })
      } else {
        this.setData({
          isError: true
        })
      }
    }).catch(err => {
      this.setData({
        isError: true
      })
      // err && err.msg ? this.toast(err && err.msg) : ''
      
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
    this.getCartNum()
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
      isError: false,
      showBack: false
    })
    // app.globalData.scene = null
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
  onShareAppMessage: function (e) {
    return {
      title: this.data.goodInfo.spu_name + this.data.skuName,
      path: '/pages/goods/goods?skuId=' + this.data.skuId + '&spuId=' + this.data.spuId
    }
  },
  share () {
    this.onShareAppMessage()
  },
  goHome () {
    wx.switchTab({
      url: '/pages/index/index',
    })
  },
  goCart () {
    if (!isLogin()) {
      wx.navigateTo({
        url: '/pages/loginType/loginType',
      })
      return
    }
    wx.switchTab({
      url: '/pages/cart/cart',
    })
  },
  toast(text) {
    let t = this.selectComponent('.toast')
    this.setData({
      toastText: text
    })
    t && t.show()
  },
  getCartNum () {
    if (!isLogin()) {
      // 未登录状态则不请求接口
      return
    }
    fecthCartSize({
      user_id: app.globalData.userInfo.user_id
    }).then(res => {
      this.setData({
        cartNum: res.data
      })
    }).catch(err => {
      // err && err.msg ? this.toast(err && err.msg) : ''
      wx.showToast({
        title: err && err.msg ? err.msg : '水果去旅行啦',
        icon: 'none'
      })
    })
  }
})