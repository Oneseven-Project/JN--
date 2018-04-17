// pages/address_add/address_add.js
import {
  fecthProvince,
  fecthCity,
  fecthArea,
  fecthStreet,
  fecthAddressUpdate,
  fecthAddressAdd
} from "../../api/index.js"
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    toastText: '',
    adressInfo: null,
    provinces: [],
    proIdx: 0,
    citys: [],
    cityIdx: 0,
    districts: [],
    disIdx: 0,
    streets: [],
    streetIdx: 0,
    isFix: false,
    is_default: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.name) {
      let adressInfo = {}
      for (var i in options) {
        adressInfo[i] = decodeURI(options[i])
      }
      this.setData({
        adressInfo: adressInfo,
        isFix: true
      })
      // 修改信息
      this.getProvince()
      this.getCity(this.data.adressInfo.province)
      this.getArea(this.data.adressInfo.city)
      this.getStreet(this.data.adressInfo.district)
    } else {
      this.setData({
        adressInfo: null,
        isFix: false
      })
    }
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
    this.getProvince()
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
  toast(text) {
    let t = this.selectComponent('.toast')
    this.setData({
      toastText: text
    })
    t && t.show()
  },
  getProvince () {
    fecthProvince({}).then(res => {
      this.setData({
        provinces: res.data
      })
    }).catch(err => {
      // err && err.msg ? this.toast(err.msg) : this.toast('获取省份失败')
      wx.showToast({
        title: err && err.msg ? err.msg : '获取省份失败',
        icon: 'none'
      })
    })
  },
  getCity (code) {
    fecthCity({
      provinceCode: code
    }).then(res => {
      this.setData({
        citys: res.data
      })
    }).catch(err => {
      wx.showToast({
        title: err && err.msg ? err.msg : '获取城市失败',
        icon: 'none'
      })
      // err && err.msg ? this.toast(err.msg) : this.toast('获取城市失败')
    })
  },
  getArea (code) {
    fecthArea({
      cityCode: code
    }).then(res => {
      this.setData({
        districts: res.data
      })
    }).catch(err => {
      wx.showToast({
        title: err && err.msg ? err.msg : '获取地区失败',
        icon: 'none'
      })
      // err && err.msg ? this.toast(err.msg) : this.toast('获取地区失败')
    })
  },
  getStreet (code) {
    fecthStreet({
      areaCode: code
    }).then(res =>{
      this.setData({
        streets: res.data
      })
    }).catch(err => {
      // err && err.msg ? this.toast(err.msg) : this.toast('获取街道失败')
      wx.showToast({
        title: err && err.msg ? err.msg : '获取街道失败',
        icon: 'none'
      })
    })
  },
  provinChange (e) {
    let index = +e.detail.value
    let item = this.data.provinces[index]
    let adressInfo = null
    if (this.data.adressInfo) {
      adressInfo = {
        ...this.data.adressInfo,
        province: item.provinceCode,
        province_name: item.provinceName
      }
    } else {
      adressInfo = {
        province: item.provinceCode,
        province_name: item.provinceName
      }
    }
    this.getCity(item.provinceCode)
    this.setData({
      adressInfo: adressInfo
    })
  },
  citysChange (e) {
    let index = +e.detail.value
    let item = this.data.citys[index]
    let adressInfo = {
      ...this.data.adressInfo,
      city:  item.cityCode,
      city_name: item.cityName
    }
    this.getArea(item.cityCode)
    this.setData({
      adressInfo: adressInfo
    })
  },
  districtChange (e) {
    let index = +e.detail.value
    let item = this.data.districts[index]
    let adressInfo = {
      ...this.data.adressInfo,
      district: item.areaCode,
      district_name: item.areaName
    }
    this.getStreet(item.areaCode)
    this.setData({
      adressInfo: adressInfo
    })
  },
  streetChange (e) {
    let index = +e.detail.value
    let item = this.data.streets[index]
    let adressInfo = {
      ...this.data.adressInfo,
      street: item.streetCode,
      street_name: item.streetName
    }
    this.setData({
      adressInfo: adressInfo
    })
  },
  addressAdd () {
    fecthAddressAdd({
      ...this.data.adressInfo
    }).then(res => {
      console.log()
    }).catch(err => {
      // this.toast('新增地址失败')
      wx.showToast({
        title: err && err.msg ? err.msg : '新增地址失败',
        icon: 'none'
      })
    })
  },
  nameInput (e) {
    this.setData({
      adressInfo: { 
        ...this.data.adressInfo,
        name: e.detail.value
      }
    })
  },
  phoneInput (e) {
    this.setData({
      adressInfo: {
        ...this.data.adressInfo,
        phone: e.detail.value
      }
    })
  },
  textareaInput (e) {
    this.setData({
      adressInfo: {
        ...this.data.adressInfo,
        address: e.detail.value
      }
    })
  },
  bindCheckbox (e) {
    let is_default = false
    if (e.detail.value.length == 1) {
      is_default = true
    } else {
      is_default = false
    }
    this.setData({
      is_default: is_default
    })
  },
  save () {
    // 先判断是否修改还是保存
    let info = this.data.adressInfo
    if (!info){
      // this.toast('请先填写信息')
      wx.showToast({
        title: '请先填写信息',
        icon: 'none'
      })
      return
    } else if (!info.name){
      // this.toast('请先填写收货人')
      wx.showToast({
        title: '请先填写收货人',
        icon: 'none'
      })
      return 
    } else if (!info.phone) {
      // this.toast('请先填写手机号码')
      wx.showToast({
        title: '请先填写手机号码',
        icon: 'none'
      })
      return
    } else if (!(info.province && info.city && info.district && info.street && info.address)) {
      // this.toast('请填写完整地址信息')
      wx.showToast({
        title: '请填写完整地址信息',
        icon: 'none'
      })
      return
    }

    if (this.data.isFix) {
      this.update()

    } else {
      this.addNew()
    }
    // 保存成功后保存
  },
  update () {
    fecthAddressUpdate({
      ...this.data.adressInfo
    }).then(res => {
      // 修改成功
      wx.navigateBack({})
    }).catch(err => {
      // err && err.msg ? this.toast(err.msg) : this.toast('修改失败')
      wx.showToast({
        title: err && err.msg ? err.msg : '修改失败',
        icon: 'none'
      })
    })
  },
  addNew () {
    fecthAddressAdd({
      ...this.data.adressInfo,
      "address_type": "HOUSE",
      country: "中国",
      is_default: this.data.is_default,
      user_id: app.globalData.userInfo.user_id
    }).then(res =>{
      // 添加成功
      if (app.globalData.isOrderAddAress){
        // 从结算页跳转来
        app.globalData.isOrderAddAress = false
      }
      wx.navigateBack({})
    }).catch(err => {
      // err && err.msg ? this.toast(err.msg) : this.toast('添加失败')
      wx.showToast({
        title: err && err.msg ? err.msg : '添加失败',
        icon: 'none'
      })
    })
  }
})