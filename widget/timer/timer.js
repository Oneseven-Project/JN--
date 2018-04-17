// widget/timer/timer.js
import {
  fetchTemplate,
  fetchTemplateData
} from '../../api/index.js'
let timer = null
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    item: {
      type: Object,
      observer (val) {
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    countTime: 0,
    tempData: {},
    tempConf: {},
    moduleId: 0,
    moduleIndex: -1
  },

  /**
   * 组件的方法列表
   */
  methods: {
    countDown() { // 倒计时，更新当前时间取比较时间区间列表
      clearInterval(timer)
      timer = null
      this.compareTime()
      let that = this
      timer = setInterval(() => {
        that.compareTime()
      }, 60000)
    },
    compareTime () {
      let currentTime = new Date().getTime()
      if (this.data.item && this.data.item.conf && this.data.item.conf.items) {
        for (let i = 0; i < this.data.item.conf.items.length; i++) {
          if (+currentTime > +this.data.item.conf.items[i].startTime && +currentTime < +this.data.item.conf.items[i].endTime) {
            if (this.data.moduleId !== +this.data.item.conf.items[i].id) {
              this.setData({
                countTime: +this.data.item.conf.items[i].endTime,
                moduleId: +this.data.item.conf.items[i].id
              })
              this.getConf(this.data.item.conf.items[i].id)
              this.countDown()
            }
            break
          } else if (i === this.data.item.conf.items.length - 1) {
            clearInterval(timer)
            this.setData({
              countTime: 0,
              tempConf: {},
              tempData: {},
              moduleId: 0
            })
          }
        }
      }
    },
    getConf(id) {
      fetchTemplate({
        template_id: id
      }).then(res => {
        this.setData({
          tempConf: JSON.parse(res.data[0].config)
        })
        this.getData(id)
      }).catch(err => {
        console.log(err)
      })
    },
    getData(id) {
      fetchTemplateData({
        template_id: id
      }).then(res => {
        this.setData({
          tempData: res.data
        })
      }).catch(err => {
        console.log(err)
      })
    }
  },
  ready () {
    this.compareTime()
  }
})
