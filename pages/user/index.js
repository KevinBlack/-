const api = require('../../helper/apis');
const req = require('../../helper/req');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    hasLogin: false,
    user: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    api.getSetting()
    .then(res=>{
      if(res.authSetting['scope.userInfo']){
        return api.getUserInfo()
      }else{
        throw new Error('没有授权用户信息');
      }
    })
    .then(user=>{
      let userInfo = wx.getStorageSync('userInfo');
      return userInfo ? userInfo : req.login(user);
    })
    .then(res=>{
      this.setData({
        hasLogin: true,
        user: res
      })
    })
    .catch(e=>{
      console.log(e);
    })
  },

  onGetUserInfo({detail}){

    if(detail.errMsg === 'getUserInfo:ok'){
      req.login(detail)
      .then(info=>{
        this.setData({
          hasLogin: true,
          user: info
        })
      })
    }
  }

})
