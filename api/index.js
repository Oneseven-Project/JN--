const env = require('../config/index.js')
const amap = require('../assets/map/amap-wx.js')
const qs = require('../assets/js/qs.js')
import { request, setConfig } from "../assets/js/wx-promise-request.js"
setConfig({
  concurrency: 50 // 限制最大并发数为 5
  // 查找github
})

const ads = function () {
  let location = getApp().globalData.location || null
  return {
    'province': location && location.province || '104104',
    'city': location && location.city || '104104101',
    'district': location && location.district || '',
    'street': location && location.street || '',
    'name': location && location.name
  }
}
function getAddress () {
  return new Promise((resolve, reject) => {
    let location = getApp().globalData.location || null
    if (!location) {
      getLocation().then(res => {
        fecthAdressCode({
          province: res.regeocodeData.addressComponent.province,
          city: res.regeocodeData.addressComponent.city,
          district: res.regeocodeData.addressComponent.district,
          street: res.regeocodeData.addressComponent.township
        }).then(data => {
          let tt = {
            'province': data.data && data.data.province_id != '0' ? data.data.province_id : "104104",
            'city': data.data &&data.data.city_id != '0' ? data.data.city_id : '104104101',
            'district': data.data && data.data.district_id != '0' ? data.data.district_id : "",
            'street': data.data && data.data.street_id != '0' ? data.data.street_id : "",
            name: data.data && data.data.city_id != '0' ? res.name : "广州市"
          }
          getApp().globalData.location = tt
          resolve(tt)
        }).catch(errs => {
          reject(errs)
        })
      }).catch(err => {
        // console.log('test err', err)
        reject(err)
      })
    } else {
      // let ads = {
      //   'province_id': location && location.province || '104104',
      //   'city_id': location && location.city || '104104101',
      //   'district_id': location && location.district || '',
      //   'street_id': location && location.street || '',
      //   "name": location && location.name || '广州市',
      // }
      resolve(location)
    }
  })
}
const getToken = function () {
  let token = wx.getStorageSync('token') || null
  return token ? { token: token } : { token: "" }
}
// 获取短信验证码
export function featcode (params) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: env.API + '/user/send/verificationCode',
      data: {
        ...ads(),
        ...params
      },
      header: {
        ...getToken()
      },
      method: 'POST',
      success: function (res) {
        if (res.data.code == 0) {
          return resolve(res.data)
        } else {
          return reject(res.data)
        }
      },
      fail: function (res) {
        return reject(res)
      }
    })
  }) 
}
// 登录
export function login (params) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: env.API + '/user/login',
      data: {
        ...ads(),
        ...params
      },
      method: 'POST',
      success: function (res) {
        if (res.data.success) {
          return resolve(res.data)
        } else {
          return reject(res.data)
        }
      },
      fail: function (res) {
        return reject(res.data)
      }
    })
  })
}
// 获取微信的用户信息
export function featUserInfo () {
  let app = getApp()
  return new Promise((resolve, reject) => {
    if (wx.canIUse('getUserInfo')) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback(res => {
        return resolve(res.userInfo)
      })
    } else {
      console.log(app, 2)
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          return resolve(res.userInfo)
        }, fail: res => {
          return reject(res)
        }
      })
    }
  })
}
// 获取地址
export function getLocation() {
  return new Promise((resolve, reject) => {
    var myAmapFun = new amap.AMapWX({ key: '10cb0997ac21f73f7208bc0e13b6087c' })
    myAmapFun.getRegeo({
      success(data) {
        return resolve(data[0])
      },
      fail(err) {
        return reject(err.errMsg)
      }
    })
  })
}
// 信息登录
export function wxLogin(params) {
  return new Promise((resolve, reject) => {
    wx.login({
      success: res => {
        return resolve(res)
      },
      fail: res => {
        return reject(res)
      }
    })  
  })
}

// 根据token获取用户信息
export function fectchUserByT(params) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: env.API + '/user/token',
      data: {
        ...ads(),
        ...params
      },
      method: 'GET',
      success: function (res) {
        if (res.data.success) {
          return resolve(res.data)
        } else {
          return reject(res.data)
        }
      },
      fail: function (res) {
        return reject(res.data)
      }
    })
  })
}
// 获取商品详情
export function fectGoodInfo(params) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: env.API + '/goods/getGoodsDetail',
      data: {
        ...ads(),
        ...params
      },
      header: {
        ...getToken()
      },
      method: 'GET',
      success: function (res) {
        if (res.data.code == 0) {
          return resolve(res.data)
        } else {
          return reject(res.data)
        }
      },
      fail: function (res) {
        return reject(res)
      }
    })
  })
}
// 获取分类页信息
export function fetchClassify(params) {
  let location = getApp().globalData.location
  return new Promise((resolve, reject) => {
    wx.request({
      method: 'GET',
      url: env.API + '/category/children',
      header: {
        ...getToken()
      },
      data: {
        ...ads(),
        ...params
      },
      success: (res) => {
        if (res.data.code === 0) {
          return resolve(res.data)
        } else {
          return reject(res.data)
        }
      },
      fail: err => {
        return reject(err.data)
      }
    })
  })
}
// 获取分类列表
export function fectclassifyList(params) {
  let location = getApp().globalData.location
  return new Promise((resolve, reject) => {
    wx.request({
      method: 'GET',
      header: {
        ...getToken()
      },
      url: env.API + '/goods/findByCatId',
      data: {
        ...ads(),
        ...params
      },
      success: (res) => {
        if (res.data.code === 0) {
          return resolve(res.data)
        } else {
          return reject(res.data)
        }
      },
      fail: err => {
        return reject(err.data)
      }
    })
  })
}
// 获取模板
export function fetchTemplate(params) {
  return new Promise((resolve, reject) => {
    wx.request({
      method: 'POST',
      url: env.OPERATION + '/api/v2/app/get.template',
      header: {
        'x-freshjn-appname': 'com.freshjn.sir',
        ...getToken()
      },
      data: {
        ...ads(),
        ...params
      },
      success: (res) => {
        if (res.data.code === 200) {
          return resolve(res.data)
        } else {
          return reject(res.data)
        }
      },
      fail: err => {
        return reject(err)
      }
    })  
  })
}
// 获取模板数据
export function fetchTemplateData(params) {
  return new Promise((resolve, reject) => {
    wx.request({
      method: 'POST',
      url: env.OPERATION + '/api/v2/app/get.data',
      header: {
        'x-freshjn-appname': 'com.freshjn.sir',
        ...getToken()
      },
      data: {
        ...ads(),
        ...params
      },
      success: (res) => {
        if (res.data.code === 200) {
          return resolve(res.data)
        } else {
          return reject(res.data)
        }
      },
      fail: err => {
        return reject(err)
      }
    })
  })
}
// 获取首页模板
export function fetchHomeTemplate(params) {
  return new Promise((resolve, reject) => {
    getAddress().then(data => {
      wx.request({
        method: 'POST',
        url: env.OPERATION + '/api/v2/app/home.template',
        header: {
          'x-freshjn-appname': 'com.freshjn.sir',
          ...getToken()
        },
        data: {
          ...data,
          ...params
        },
        success: (res) => {
          if (res.data.code === 200) {
            return resolve(res.data)
          } else {
            return reject(res.data)
          }
        },
        fail: err => {
          console.log(err, '请求失败')
          return reject(err)
        }
      })
    }).catch(err => {
      console.log(err, '获取地址失败')
      reject(err)
    })
  })
}
// 获取首页数据
export function fetchHomeData(params) {
  return new Promise((resolve, reject) => {
    getAddress().then(data => {
      // let location = {
      //   province: data.province_id,
      //   city: data.city_id,
      //   district: data.district_id,
      //   street: data.street_id
      // }
      // getApp().globalData.location = { name: data.name, ...location}
      wx.request({
        method: 'POST',
        url: env.OPERATION + '/api/v2/app/home.data',
        header: {
          'x-freshjn-appname': 'com.freshjn.sir',
          ...getToken()
        },
        data: {
          ...data,
          ...params
        },
        success: (res) => {
          if (res.data.code === 200) {
            return resolve(res.data)
          } else {
            return reject(res.data)
          }
        },
        fail: err => {
          return reject(err)
        }
      })
    }).catch(err => {
      reject(err)
    })
  })
}
// 获取门店列表
export function fecthStoreList(params) {
  let location = getApp().globalData.location
  return new Promise((resolve, reject) => {
    wx.request({
      method: 'GET',
      header: {
        ...getToken()
      },
      url: env.API + '/goods/sellerSkuList',
      data: {
        ...ads(),
        ...params
      },
      success: (res) => {
        if (res.data.code === 0) {
          return resolve(res.data)
        } else {
          return reject(res.data)
        }
      },
      fail: err => {
        return reject(err.data)
      }
    })
  })
}
// 获取开通城市列表
export function fecthCityList(params) {
  let location = getApp().globalData.location
  return new Promise((resolve, reject) => {
    wx.request({
      method: 'GET',
      header: {
        ...getToken()
      },
      url: env.API + '/open/address/sale',
      data: {
        ...ads(),
        ...params
      },
      success: (res) => {
        if (res.data.code === 0) {
          return resolve(res.data)
        } else {
          return reject(res.data)
        }
      },
      fail: err => {
        return reject(err.data)
      }
    })
  })
}
// 获取商品列表排序
export function fecthBySkuIds(params) {
  let location = getApp().globalData.location
  return new Promise((resolve, reject) => {
    wx.request({
      method: 'GET',
      header: {
        ...getToken()
      },
      url: env.API + '/goods/findBySkuIds?' + qs.stringify({ ...params, ...ads() }, { arrayFormat: 'repeat' }),
      // data: {
      //   ...ads(),
      //   ...params
      // },
      success: (res) => {
        if (res.data.code === 0) {
          return resolve(res.data)
        } else {
          return reject(res.data)
        }
      },
      fail: err => {
        return reject(err.data)
      }
    })
  })
}
// 添加购物车商品
export function fecthCartAdd(params) {
  let location = getApp().globalData.location
  return new Promise((resolve, reject) => {
    wx.request({
      method: 'POST',
      header: {
        ...getToken()
      },
      url: env.API + '/cart/add',
      data: {
        ...ads(),
        ...params
      },
      success: (res) => {
        if (res.data.code === 0) {
          return resolve(res.data)
        } else {
          return reject(res.data)
        }
      },
      fail: err => {
        return reject(err.data)
      }
    })
  })
}
// 地址转码
export function fecthAdressCode(params) {
  return new Promise((resolve, reject) => {
    wx.request({
      method: 'GET',
      header: {
        ...getToken()
      },
      url: env.API + '/open/address/sale/location',
      data: {
        ...params
      },
      success: (res) => {
        if (res.data.code === 0) {
          return resolve(res.data)
        } else {
          return reject(res.data)
        }
      },
      fail: err => {
        return reject(err.data)
      }
    })
  })
}
// 查询购物车商品列表
export function fecthCart(params) {
  let location = getApp().globalData.location
  return new Promise((resolve, reject) => {
    wx.request({
      method: 'GET',
      header: {
        ...getToken()
      },
      url: env.API + '/cart?' + qs.stringify({ ...params, ...ads() }, { arrayFormat: 'repeat' }),
      success: (res) => {
        if (res.data.code === 0) {
          return resolve(res.data)
        } else {
          return reject(res.data)
        }
      },
      fail: err => {
        return reject(err.data)
      }
    })
  })
}
// 修改购物车数量
export function fecthCartUpdate(params) {
  let location = getApp().globalData.location
  return new Promise((resolve, reject) => {
    wx.request({
      method: 'POST',
      header: {
        ...getToken()
      },
      url: env.API + '/cart/update',
      data: {
        ...ads(),
        ...params
      },
      success: (res) => {
        if (res.data.code === 0) {
          return resolve(res.data)
        } else {
          return reject(res.data)
        }
      },
      fail: err => {
        return reject(err.data)
      }
    })
  })
}
// 购物车删除商品
export function fecthCartDelecte (params) {
  let location = getApp().globalData.location
  return new Promise((resolve, reject) => {
    wx.request({
      method: 'POST',
      header: {
        ...getToken()
      },
      url: env.API + '/cart/delete',
      data: {
        ...ads(),
        ...params
      },
      success: (res) => {
        if (res.data.code === 0) {
          return resolve(res.data)
        } else {
          return reject(res.data)
        }
      },
      fail: err => {
        return reject(err.data)
      }
    })
  })
}
// 查询购物车商品总数量
export function fecthCartSize(params) {
  let location = getApp().globalData.location
  return new Promise((resolve, reject) => {
    wx.request({
      method: 'GET',
      header: {
        ...getToken()
      },
      url: env.API + '/cart/size',
      data: {
        ...ads(),
        ...params
      },
      success: (res) => {
        if (res.data.code === 0) {
          return resolve(res.data)
        } else {
          return reject(res.data)
        }
      },
      fail: err => {
        return reject(err.data)
      }
    })
  })
}
// 计算商品总价
export function fecthTotalAmt(params) {
  let location = getApp().globalData.location
  return new Promise((resolve, reject) => {
    wx.request({
      method: 'POST',
      header: {
        ...getToken()
      },
      data: {
        // ...ads(),
        ...params
      },
      url: env.API + '/order/calculate/overall/amt',
      success: (res) => {
        if (res.data.code === 0) {
          return resolve(res.data)
        } else {
          return reject(res.data)
        }
      },
      fail: err => {
        return reject(err.data)
      }
    })
  })
}
// 去结算
export function fecthPreCheckout(params) {
  let location = getApp().globalData.location
  return new Promise((resolve, reject) => {
    wx.request({
      method: 'POST',
      header: {
        ...getToken()
      },
      url: env.API + '/order/pre/checkout',
      data: {
        ...ads(),
        ...params
      },
      success: (res) => {
        if (res.data.code === 0) {
          return resolve(res.data)
        } else {
          return reject(res.data)
        }
      },
      fail: err => {
        return reject(err.data)
      }
    })
  })
}
// 校验库存
export function fecthStock(params) {
  let location = getApp().globalData.location
  return new Promise((resolve, reject) => {
    wx.request({
      method: 'GET',
      header: {
        ...getToken()
      },
      url: env.API + '/stock/leaving?' + qs.stringify({ ...params, ...ads()}, { arrayFormat: 'repeat' }),
      success: (res) => {
        if (res.data.code === 0) {
          return resolve(res.data)
        } else {
          return reject(res.data)
        }
      },
      fail: err => {
        return reject(err.data)
      }
    })
  })
}
// 结算并吊起支付
export function fecthCheckout(params) {
  let location = getApp().globalData.location
  return new Promise((resolve, reject) => {
    wx.request({
      method: 'POST',
      header: {
        ...getToken()
      },
      url: env.API + '/order/checkout',
      data: {
        // ...ads(),
        ...params
      },
      success: (res) => {
        if (res.data.code === 0) {
          return resolve(res.data)
        } else {
          return reject(res.data)
        }
      },
      fail: err => {
        return reject(err.data)
      }
    })
  })
}
// 获取地址列表
export function fecthAddressList(params) {
  let location = getApp().globalData.location
  return new Promise((resolve, reject) => {
    wx.request({
      method: 'GET',
      header: {
        ...getToken()
      },
      url: env.API + '/user/address/query',
      data: {
        // ...ads(),
        ...params
      },
      success: (res) => {
        if (res.data.code === 0) {
          return resolve(res.data)
        } else {
          return reject(res.data)
        }
      },
      fail: err => {
        return reject(err.data)
      }
    })
  })
}
// 修改用户收货地址
export function fecthAddressUpdate(params) {
  // let location = getApp().globalData.location
  return new Promise((resolve, reject) => {
    wx.request({
      method: 'POST',
      header: {
        ...getToken()
      },
      url: env.API + '/user/address/update',
      data: {
        // ...ads(),
        ...params
      },
      success: (res) => {
        if (res.data.code === 0) {
          return resolve(res.data)
        } else {
          return reject(res.data)
        }
      },
      fail: err => {
        return reject(err.data)
      }
    })
  })
}
// 删除用户收货地址
export function fecthAddressDelete(params) {
  // let location = getApp().globalData.location
  return new Promise((resolve, reject) => {
    wx.request({
      method: 'POST',
      header: {
        ...getToken()
      },
      url: env.API + '/user/address/delete',
      data: {
        // ...ads(),
        ...params
      },
      success: (res) => {
        if (res.data.code === 0) {
          return resolve(res.data)
        } else {
          return reject(res.data)
        }
      },
      fail: err => {
        return reject(err.data)
      }
    })
  })
}
// 添加用户收货地址
export function fecthAddressAdd(params) {
  // let location = getApp().globalData.location
  return new Promise((resolve, reject) => {
    wx.request({
      method: 'POST',
      header: {
        ...getToken()
      },
      url: env.API + '/user/address/add',
      data: {
        // ...ads(),
        ...params
      },
      success: (res) => {
        if (res.data.code === 0) {
          return resolve(res.data)
        } else {
          return reject(res.data)
        }
      },
      fail: err => {
        return reject(err.data)
      }
    })
  })
}
// 获取省份
export function fecthProvince(params) {
  // let location = getApp().globalData.location
  return new Promise((resolve, reject) => {
    wx.request({
      method: 'GET',
      header: {
        ...getToken()
      },
      url: env.API + '/open/address/province',
      data: {
        // ...ads(),
        ...params
      },
      success: (res) => {
        if (res.data.code === 0) {
          return resolve(res.data)
        } else {
          return reject(res.data)
        }
      },
      fail: err => {
        return reject(err.data)
      }
    })
  })
}
// 获取城市
export function fecthCity(params) {
  // let location = getApp().globalData.location
  return new Promise((resolve, reject) => {
    wx.request({
      method: 'GET',
      header: {
        ...getToken()
      },
      url: env.API + '/open/address/city',
      data: {
        // ...ads(),
        ...params
      },
      success: (res) => {
        if (res.data.code === 0) {
          return resolve(res.data)
        } else {
          return reject(res.data)
        }
      },
      fail: err => {
        return reject(err.data)
      }
    })
  })
}
// 获取区
export function fecthArea(params) {
  // let location = getApp().globalData.location
  return new Promise((resolve, reject) => {
    wx.request({
      method: 'GET',
      header: {
        ...getToken()
      },
      url: env.API + '/open/address/area',
      data: {
        // ...ads(),
        ...params
      },
      success: (res) => {
        if (res.data.code === 0) {
          return resolve(res.data)
        } else {
          return reject(res.data)
        }
      },
      fail: err => {
        return reject(err.data)
      }
    })
  })
}
// 获取街道
export function fecthStreet(params) {
  // let location = getApp().globalData.location
  return new Promise((resolve, reject) => {
    wx.request({
      method: 'GET',
      header: {
        ...getToken()
      },
      url: env.API + '/open/address/street',
      data: {
        // ...ads(),
        ...params
      },
      success: (res) => {
        if (res.data.code === 0) {
          return resolve(res.data)
        } else {
          return reject(res.data)
        }
      },
      fail: err => {
        return reject(err.data)
      }
    })
  })
}

// 获取订单列表
export function fecthOrderlist(params) {
  // let location = getApp().globalData.location
  return new Promise((resolve, reject) => {
    wx.request({
      method: 'GET',
      header: {
        ...getToken()
      },
      url: env.API + '/order/list',
      data: {
        // ...ads(),
        ...params
      },
      success: (res) => {
        if (res.data.code === 0) {
          return resolve(res.data)
        } else {
          return reject(res.data)
        }
      },
      fail: err => {
        return reject(err.data)
      }
    })
  })
}
// 获取订单详情
export function fecthOrderDetail(params) {
  return new Promise((resolve, reject) => {
    wx.request({
      method: 'GET',
      header: {
        ...getToken()
      },
      url: env.API + '/order/detail',
      data: {
        ...params
      },
      success: (res) => {
        if (res.data.code === 0) {
          return resolve(res.data)
        } else {
          return reject(res.data)
        }
      },
      fail: err => {
        return reject(err.data)
      }
    })
  })
}
// 取消订单
export function fecthOrderCancel(params) {
  return new Promise((resolve, reject) => {
    wx.request({
      method: 'GET',
      header: {
        ...getToken()
      },
      url: env.API + '/order/cancel',
      data: {
        ...params
      },
      success: (res) => {
        if (res.data.code === 0) {
          return resolve(res.data)
        } else {
          return reject(res.data)
        }
      },
      fail: err => {
        return reject(err.data)
      }
    })
  })
}
// 再次购买
export function fecthBuyAgain(params) {
  return new Promise((resolve, reject) => {
    wx.request({
      method: 'POST',
      header: {
        ...getToken()
      },
      url: env.API + '/cart/add/bulk',
      data: {
        ...params
      },
      success: (res) => {
        if (res.data.code === 0) {
          return resolve(res.data)
        } else {
          return reject(res.data)
        }
      },
      fail: err => {
        return reject(err.data)
      }
    })
  })
}
// 再次支付
export function fecthPayAgain(params) {
  return new Promise((resolve, reject) => {
    wx.request({
      method: 'POST',
      header: {
        ...getToken()
      },
      url: env.API + '/order/checkout/repay',
      data: {
        ...params
      },
      success: (res) => {
        if (res.data.code === 0) {
          return resolve(res.data)
        } else {
          return reject(res.data)
        }
      },
      fail: err => {
        return reject(err.data)
      }
    })
  })
}
// 签收
export function fecthSignfor(params) {
  return new Promise((resolve, reject) => {
    wx.request({
      method: 'GET',
      header: {
        ...getToken()
      },
      url: env.API + '/order/shipment/receive',
      data: {
        ...params
      },
      success: (res) => {
        if (res.data.code === 0) {
          return resolve(res.data)
        } else {
          return reject(res.data)
        }
      },
      fail: err => {
        return reject(err.data)
      }
    })
  })
}
// 红包列表
export function fecthCopon(params) {
  return new Promise((resolve, reject) => {
    wx.request({
      method: 'GET',
      header: {
        ...getToken()
      },
      url: env.API + '/coupon/user/list',
      data: {
        ...params
      },
      success: (res) => {
        if (res.data.code === 0) {
          return resolve(res.data)
        } else {
          return reject(res.data)
        }
      },
      fail: err => {
        return reject(err.data)
      }
    })
  })
}
// 模板中申请的红包列表
export function fecthCoponByIds(params) {
  return new Promise((resolve, reject) => {
    wx.request({
      method: 'GET',
      header: {
        ...getToken()
      },
      url: env.API + '/coupon/list?' + qs.stringify(params, { arrayFormat: 'repeat' }),
      success: (res) => {
        if (res.data.code === 0) {
          return resolve(res.data)
        } else {
          return reject(res.data)
        }
      },
      fail: err => {
        return reject(err.data)
      }
    })
  })
}

// 领取红包
export function fecthGetCoupons(params) {
  return new Promise((resolve, reject) => {
    wx.request({
      method: 'POST',
      header: {
        ...getToken()
      },
      url: env.API + '/coupon/apply',
      data: {
        ...params
      },
      success: (res) => {
        if (res.data.code === 0) {
          return resolve(res.data)
        } else {
          return reject(res.data)
        }
      },
      fail: err => {
        return reject(err.data)
      }
    })
  })
}
// 获取广告
export function fecthGetAd(params) {
  return new Promise((resolve, reject) => {
    wx.request({
      method: 'POST',
      header: {
        ...getToken(),
        'x-freshjn-appname': 'com.freshjn.sir',
      },
      url: env.OPERATION + '/api/v2/app/get.ad',
      data: {
        ...params
      },
      success: (res) => {
        if (res.data.code === 200) {
          return resolve(res.data)
        } else {
          return reject(res.data)
        }
      },
      fail: err => {
        return reject(err.data)
      }
    })
  })
}