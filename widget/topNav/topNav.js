// widget/topNav/topNav.js
import {
  fetchTemplate,
  fetchTemplateData
} from '../../api/index.js'
let app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    item:{
      type:Object,
      observer (val) {
        // console.log(val, 'topNav')
        this.setData({
          tabs: val.conf.items,
          currentModelId: val.conf.items[0].id
        })
        this.getConf(val.conf.items[0].id)
      }
    },
    tempData: {
      type:Object
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    tabs: [],
    templateConf: {},
    templateData: {},
    currentModelId: 0,
  },
  ready () {
    app.globalData.topNavRefresh = this.refresh.bind(this)
  },
  /**
   * 组件的方法列表
   */
  methods: {
    getConf (id) {
      fetchTemplate({
        template_id: id
      }).then(res => {
        this.setData({
          templateConf: res.data[0].config && JSON.parse(res.data[0].config)
        })
        wx.stopPullDownRefresh()
        this.getData(id)
      }).catch(err => {
        wx.stopPullDownRefresh()
        console.log(err)
      })
    },
    getData (id) {
      fetchTemplateData({
        template_id: id
      }).then(res => {
        this.setData({
          templateData: res.data
        })
      }).catch(err => {
        console.log(err)
      })
    },
    tabClick (event) {
      wx.pageScrollTo({
        scrollTop: 0
      })
      this.getConf(event.detail.item.id)
      this.setData({
        currentModelId: event.detail.item.id
      })
    },
    refresh () {
      this.getConf(this.data.currentModelId)
    }
  }
})
