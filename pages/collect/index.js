const req = require('../../helper/req');
// pages/collent/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function (options) {
    let userInfo = wx.getStorageSync('userInfo');

    req.getFav(userInfo.openId)
    .then(res=>{
      if(res.code===0){
        this.setData({
          list: res.data.map(item=>item.info)
        })
      }
      // console.log(res);
    })
  },

})
