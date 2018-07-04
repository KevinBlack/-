const api = require('../../helper/apis');
const req = require('../../helper/req');

//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    guessLike: [],
    page: 2,
    isListLoading: false,
    isLoadedAll: false,
    curtCity: '北京'
  },

  onLoad: function () {

    req.getShops({}, {
      page:1,
      rows: 10
    })
    .then(res=>{
      if(res.length){
        this.setData({
          guessLike: [...res]
        })
      }
    });
  },

  onShow(){
    let curtCity = wx.getStorageSync('curtCity');
    if(curtCity){
      this.setData({
        curtCity
      });
    }
  },

  onReachBottom(){

    let {page, guessLike, isListLoading, isLoadedAll} = this.data;

    if(isListLoading || isLoadedAll) return ;

    this.setData({
      isListLoading: true
    })

    req.getShops({}, {
      page: page,
      rows: 10
    })
    .then(res=>{
      if(res.length){
        this.setData({
          guessLike: [...guessLike, ...res],
          page: page + 1,
          isListLoading: false
        })
      }
      if(res.error){
        this.setData({
          isListLoading: false,
          isLoadedAll: true
        })
      }
    })
  }

})
