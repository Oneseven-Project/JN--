// widget/jn-tab/jn-tab.js
import {
  fetchTemplate,
  fetchTemplateData
} from '../../api/index.js'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    item: {
      type: Object,
      observer(val) {
        console.log(val, 'tab')
        this.setData({
          currentModelId: val.conf.items[0].id
        })
        this.getConf(val.conf.items[0].id)
      }
    },
    tempData: {
      type: Object
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    activatedIdx: 0,
    templateConf: {},
    templateData: {},
    currentModelId: 0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    tabClick (e) {
      console.log(e)
      this.setData({
        activatedIdx: e.currentTarget.dataset.index,
        currentModelId: e.currentTarget.dataset.item.id
      })
      this.getConf(e.currentTarget.dataset.item.id)
    },
    getConf(id) {
      fetchTemplate({
        template_id: id
      }).then(res => {
        this.setData({
          templateConf: res.data[0].config && JSON.parse(res.data[0].config)
        })
        console.log(JSON.parse(res.data[0].config), 'templatedata')
        wx.stopPullDownRefresh()
        this.getData(id)
      }).catch(err => {
        wx.stopPullDownRefresh()
        // console.log(err)
        wx.showToast({
          title: err && err.msg ? err.msg : '获取模板失败',
          icon: 'none'
        })
      })
    },
    getData(id) {
      fetchTemplateData({
        template_id: id
      }).then(res => {
        this.setData({
          templateData: res.data
        })
      }).catch(err => {
        console.log(err)
        wx.showToast({
          title: err && err.msg ? err.msg : '获取数据失败',
          icon: 'none'
        })
      })
    },
  }
})
