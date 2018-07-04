const req = require('../../helper/req');

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  onGetUserInfo({detail}){
    if(detail.errMsg === 'getUserInfo:ok'){
      req.login(detail)
      .then(userInfo=>{
        wx.navigateBack()
      })
    }
  }

})
