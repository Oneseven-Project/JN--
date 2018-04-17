// pages/cart/cart.js
const qs = require('../../assets/js/qs.js')
import {
  getLocation,
  fecthCart,
  fecthCartDelecte,
  fecthCartUpdate,
  fecthTotalAmt,
  fecthAdressCode,
  fecthPreCheckout,
  fecthStock
} from '../../api/index.js'
import { isLogin } from '../../utils/index.js'
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    toastText: '',
    address: '',
    addressInfo: {},
    cartList: [],
    location: '',
    total: 0,
    totalNum: 0,
    all_disable: false,
    all_select: true,
    isError: false,
    noLogin: false,
    modelOption: {
      title: '',
      list: [],
      btn2: '',
      resp_type: 0,
      cartId: []
    }
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

    if (!isLogin()) {
      this.setData({
        noLogin: true
      })
      // wx.redirectTo({
      //   url: '/pages/loginType/loginType',
      // })
      app.globalData.isFromCart = true
      return
    }
    this.location()
    this.getCarList()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.setData({
      isError: false,
      noLogin: false
    })
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
  toast(text) {
    let t = this.selectComponent('.toast')
    this.setData({
      toastText: text
    })
    t && t.show()
  },
  showmodel () {
    let m = this.selectComponent('.jn-model') || null
    m && m.show()
  },
  toChooseCity () {
    wx.navigateTo({
      url: '/pages/cityChoose/cityChoose'
    })
  },
  location () {
    if (app.globalData && app.globalData.location) {
      this.setData({
        address: app.globalData.location.name
      })
    } else {}
  },
  allCheck () {
    let cartlist = this.data.cartList
    if (this.data.all_select) {
      // 全不选
      cartlist = cartlist.map(item => {
        if (!item.list_is_disable) {
          item.list_is_select = false
        }
        item.item_list.map(good => {
          if (!good.is_disable) {
            good.is_select = false
          }
        })
        return item
      })
    } else {
     // 全选
      cartlist = cartlist.map(item => {
        if (!item.list_is_disable) {
          item.list_is_select = true
        }
        item.item_list.map(good => {
          if (!good.is_disable) {
            good.is_select = true
          }
        })
        return item
      })
    }
    this.match(cartlist)
    this.setData({
      cartList: cartlist,
      all_select: !this.data.all_select
    })
  },
  goodsCheck(e) {
    // 单品选择
    console.log(e.currentTarget.dataset.item, e.currentTarget.dataset.cartindex)
    let is_select = e.currentTarget.dataset.item.is_select
    let cartIndex = e.currentTarget.dataset.cartindex
    let goodIndex = e.currentTarget.dataset.index
    let cartlist = this.data.cartList
    let storeObj = cartlist[cartIndex]
    let good = e.currentTarget.dataset.item
    let skus = cartlist[cartIndex].item_list
    let invalid = 0
    let selectNum = 0
    let listInvalid = 0
    let listSelect = 0
    good.is_select = !is_select
    skus[goodIndex] = good
    storeObj.item_list = skus
    cartlist[cartIndex] = storeObj
    skus.forEach(item => {
      if (item.is_disable) {
        invalid += 1
      }
      if (item.is_select) {
        selectNum += 1
      }
    })
    if (selectNum == skus.length - invalid) {
      // 商品全选了
      storeObj.list_is_select = true
    } else {
      // 商品非全选
      storeObj.list_is_select = false
    }
    cartlist.forEach(list => {
      if (list.list_is_disable) {
        listInvalid += 1
      }
      if (list.list_is_select) {
        listSelect += 1
      }
    })
    if (listSelect == cartlist.length - listInvalid) {
      // 商品列表也全选了
      this.setData({
        all_select: true
      })
    } else {
      // 商品列表非全选
      this.setData({
        all_select: false
      })
    }
    this.match(cartlist)
    this.setData({
      cartList: cartlist
    })
  },
  listCheck(e) {
    let is_select = e.currentTarget.dataset.isselect
    let is_disable = e.currentTarget.dataset.isdisable
    let cartindex = e.currentTarget.dataset.cartindex
    let cartList = this.data.cartList
    let listInfo = this.data.cartList[cartindex]
    let skus = []
    if (is_select) {
      // 取消全选
      skus = listInfo.item_list.map(item => {
        if (!item.is_disable) {
          item.is_select = false
        }
        return item
      })
    } else {
      skus = listInfo.item_list.map(item => {
        if (!item.is_disable) {
          item.is_select = true
        }
        return item
      })
      // 全选
    }
    listInfo.list_is_select = !is_select
    listInfo.item_list = skus
    cartList[cartindex] = listInfo
    // 判断是否所有列表选中
    let list_invalid = 0
    let list_select = 0
    cartList.forEach(list => {
      if (list.list_is_disable) {
        list_invalid += 1
      }
      if (list.list_is_select) {
        list_select += 1
      }
    })
    if (list_select == cartList.length - list_invalid) {
      this.setData({
        all_select: true
      })
    } else {
      this.setData({
        all_select: false
      })
    }
    this.match(cartList)
    this.setData({
      cartList: cartList
    })
  },
  match (arr) {
    let cartIds = []
    let num = 0
    arr.forEach(list => {
      list.item_list.forEach(good => {
        if (good.is_select) {
          cartIds.push(good.item.cart_item_id)
          num += good.item.quantity
        }
      })
    })
     this.setData({
      totalNum: num
    })
    this.getTotal(cartIds)
  },
  delgood(e) {
    let good = e.currentTarget.dataset.item
    let _this = this
    wx.showModal({
      title: '确定要删除该商品',
      content: good.item.spu_name + good.item.sku_name,
      success (res) {
        if(res.confirm){
          // 确认删除了
          _this.delectGood(good.item.cart_item_id)
        }
      }
    })
  },
  cartAdd(e) {
    let good = e.currentTarget.dataset.item
    let index = e.currentTarget.dataset.index
    let cartList = this.data.cartList
    cartList = cartList.map(store => {
      store.item_list.map(goodItem => {
        if (goodItem.item.sku_id == good.sku_id) {
          goodItem.item.quantity = goodItem.item.quantity + 1
        }  
      })
      return store
    })
    this.setData({
      cartList: cartList
    })
    this.uptateGood(good.cart_item_id,good.quantity + 1, good.sku_id, 1)
  },
  cartReduce (e) {
    let good = e.currentTarget.dataset.item
    let index = e.currentTarget.dataset.index
    let _this = this
    if (good.quantity == 1) {
      wx.showModal({
        title: '确定要删除该商品',
        content: good.spu_name + good.sku_name,
        success(res) {
          if (res.confirm) {
            // 确认删除了
            _this.delectGood(good.cart_item_id)
          }
        }
      })
    } else {
      // 当仅剩**件的时候，减至最少。
      let cartList = this.data.cartList
      cartList = cartList.map(store => {
        store.item_list.map(goodItem => {
          if (goodItem.item.sku_id == good.sku_id) {
            goodItem.item.quantity = +goodItem.item.quantity - 1
          }
        })
        return store
      })
      this.setData({
        cartList: cartList
      })
      _this.uptateGood(good.cart_item_id, good.quantity - 1, good.sku_id, 2)
    }
  },
  clearing () {
    // 去结算
    let cartIds = []
    let num = 0
    this.data.cartList.forEach(list => {
      list.item_list.forEach(good => {
        if (good.is_select) {
          cartIds.push(good.item.cart_item_id)
        }
      })
    })
    if (this.data.totalNum == 0) {
      // this.toast("请先选择商品")
      wx.showToast({
        title: '请先选择商品',
        icon: 'none'
      })
      return
    }
    fecthPreCheckout({
      ...this.data.addressInfo,
      cart_item_ids: cartIds,
      user_id: app.globalData.userInfo.user_id
    }).then(res => {
      let _this = this
      switch (res.data.resp_type) {
        case 1:
          // 直接跳转
          this.toStatement(cartIds)
          break
        case 2:
        // 全售罄
          this.modelAction({
            title: '商品全售罄',
            list: res.data && res.data.skus || [],
            btn2: '回首页逛逛',
            resp_type: 2
          })
          break
        case 3:
        // 部分商品售罄
          this.modelAction({
            title: '以下商品已售罄',
            list: res.data && res.data.skus || [],
            btn2: '移除无货商品',
            resp_type: 3
          })
          break
        case 4:
          // 商品库存不足
          this.modelAction({
            title: '以下商品库存不足',
            list: res.data && res.data.skus || [],
            btn2: '确定',
            resp_type: 4
          })
          break
        case 5:
        // 价格变动
          this.modelAction({
            title: '以下商品售价有变动',
            list: res.data && res.data.skus || [],
            btn2: '继续结算',
            resp_type: 5,
            cartId: cartIds
          })
          break
      }
    }).catch(err => {
      // err && err.msg ? this.toast(err.msg) : this.toast('操作失败')
      wx.showToast({
        title: err && err.msg ? err.msg : '操作失败',
        icon: 'none'
      })
    })
  },
  modelAction (obj) {
    this.setData({
      modelOption: {...obj}
    })
    this.showmodel()
  },
  toStatement (cartIds = []) {
    // 去订单确认页
    app.globalData.isDefaultCart = true
    wx.navigateTo({
      url: '../statement/statement?' + qs.stringify(cartIds, { arrayFormat: 'repeat' }),
    })
  },
  getCarList () {
    fecthCart({
      user_id: app.globalData.userInfo.user_id
    }).then(res => {
      let data = res.data
      let goodInvalid = 0
      let storeInvalid = 0
      let skuIds = []
      let storelist = []
      if (data.seller_list && data.seller_list.length == 0) {
        this.setData({
          isError: true,
          cartList: []
        })
        return
      }
      data.seller_list.map(store => {
        store.item_list.forEach(good => {
          skuIds.push(good.item.sku_id) 
        })
      })
      // 检查库存
      this.checkStock(skuIds).then(res => {
        storelist = data.seller_list.map(list => {
          list.item_list.map(good => {
            let good2 = res.data.find(good2 => good2.sku_id == good.item.sku_id)
            good.item.stock = (good2 && good2.leaving_stock) || 0
          })
          return list
        })
        storelist = storelist.map(store => {
          if (store.location) {
            // 在销售区域
            store.item_list.forEach(good => {
              if (good.item.is_on_sale && good.item.stock > 0) {
                good.is_select = true
                good.is_disable = false
              } else {
                goodInvalid += 1
                good.is_select = false
                good.is_disable = true
              }
            })

            if (goodInvalid == store.item_list.length) {
              store.list_is_select = false
              store.list_is_disable = true
            } else {
              store.list_is_select = true
              store.list_is_disable = false
            }
            if (store.list_is_disable) {
              storeInvalid += 1
            }

          } else {
            // 不在销售区域
            store.list_is_select = false
            store.list_is_disable = true
            store.item_list.forEach(good => {
              good.is_select = false
              good.is_disable = true
            })
            storeInvalid += 1
          }
          
          return store
        })
        this.match(storelist)
        if (storeInvalid == storelist.length) {
          this.setData({
            all_disable: true,
            all_select: false,
            cartList: storelist ? storelist : []
          })
        } else {
          this.setData({
            all_disable: false,
            all_select: true,
            cartList: storelist ? storelist : []
          })
        }
      }).catch(err => {
        // err && err.msg ? this.toast(err.msg) : this.toast("获取数据失败")
        wx.showToast({
          title: err && err.msg ? err.msg : '获取数据失败',
          icon: 'none'
        })
      })
    }).catch(err => {
      err && err.msg ? this.toast(err.msg) : ""
    })
  },
  toGoodDetial (e) {
    let skuId = e.currentTarget.dataset.item.sku_id || ''
    let spuId = e.currentTarget.dataset.item.spu_id || ''
    if (skuId && spuId) {
      wx.navigateTo({
        url: '/pages/goods/goods?skuId=' + skuId + '&spuId=' + spuId,
      })
    }
  },
  uptateGood (cartId, num, skuId, uptype) {
    // uptype = 1 为加商品 
    fecthCartUpdate({
      ...this.data.addressInfo,
      "cart_item_id": cartId,
      "quantity": num,
      "sku_id": skuId,
      "user_id": app.globalData.userInfo.user_id
    }).then(res => {
      if (res.data && res.data.error) {
        let cartList = this.data.cartList
        cartList = cartList.map(store => {
          store.item_list.map(good => {
            if (skuId == good.item.sku_id) {
              if (res.data.error.code == 4010) {
                // 仅剩***件时，直接赋值到剩余件数
                good.item.quantity = res.data.error.leavingStock
              } else {
                uptype == 1 ? good.item.quantity-- : good.item.quantity++
              }
            }
          })
          return store
        })
        this.setData({
          cartList: cartList
        })
        this.toast(res.data.error.message)
      } else {
        // 改变该商品的数组
        let cartList = this.data.cartList.map(store => {
          store.item_list.map(goodItem => {
            if (goodItem.item.sku_id == skuId) {
              goodItem.item = { 
                ...res.data.item,
                spu_name: goodItem.item.spu_name
              }
            }
          })
          return store
        })
        this.match(cartList)
        this.setData({
          cartList: cartList
        })
      }
    }).catch(err => {
      let cartList = this.data.cartList
      cartList = cartList.map(store => {
        store.item_list.map(good => {
          if (skuId == good.item.sku_id) {
            uptype == 1 ? good.item.quantity-- : good.item.quantity++
          }
        })
        return store
      })
      this.setData({
        cartList: cartList
      })
      // err && err.msg ? this.toast(err.msg) : this.toast('操作失败')
      wx.showToast({
        title: err && err.msg ? err.msg : '操作失败',
        icon: 'none'
      })
    })
  },
  delectGood (cartId) {
    fecthCartDelecte({
      "cart_item_ids": [cartId],
      "region_id": 0,
      "user_id": app.globalData.userInfo.user_id
    }).then(res => {
      this.getCarList()
    }).catch(err => {
      // err && err.msg ? this.toast(err.msg) : this.toast('删除操作失败')
      wx.showToast({
        title: err && err.msg ? err.msg : '删除操作失败',
        icon: 'none'
      })
    })
  },
  getTotal (carIds = [],) {
    fecthTotalAmt({
      user_id: app.globalData.userInfo.user_id,
      cat_item_ids: carIds,
      type: 'CART'
    }).then(res =>{
      let num = res.data && res.data.product_sa || 0
      this.setData({
        total: num.toFixed(2)
      })
    }).catch(err => {
      // err && err.msg ? this.toast(err.msg) : this.toast('获取数据失败')
      wx.showToast({
        title: err && err.msg ? err.msg : '获取数据失败',
        icon: 'none'
      })
    })
  },
  checkStock(skus = []) {
    return fecthStock({
      sku_id: skus
    })
  }
})