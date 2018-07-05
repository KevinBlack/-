const req = require('../../helper/req');
const api = require('../../helper/apis');

const qqmapsdk = new api.createQQMap();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    shopID: '', // 商铺的 id
    favID: '', // 收藏的 id
    info: {},
    address: '',
    distance: '', // 我的位置到店铺的距离
    hasLocationAuth: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (query) {
    this.setData({
      shopID: query.id
    });
    req.getShopDetail(query.id)
    .then(data=>{
      console.log(data)
      if(!data.error){
        this.setData({
          info: data.info
        });
        return {
          latitude: data.info.lat,
          longitude: data.info.lng
        }
      }else{
        throw '获取商铺详情失败'
      }
    })
    .then(location=>{
      return Promise.all([
        qqmapsdk.reverseGeocoder({location}),
        this._getLocation(location),
        location
      ])
    })
    .then(([shopAddress, myLocation, toLocation])=>{
      if(shopAddress.status === 0){
        this.setData({
          address: shopAddress.result.address
        })
      }

    })
    .catch(e=>{


    })
  },

  onShow(){
    let {info} = this.data;
    let arr = Object.keys(info);
    if(arr.length){
      this._getLocation({
        latitude: info.lat,
        longitude: info.lng
      })
    }

    let userInfo = wx.getStorageSync('userInfo');

    if(userInfo){
      req.checkFav({
        open_id: userInfo.openId,
        article_id: this.data.shopID
      })
      .then(res=>{
        if(res.code===0){
          this.setData({
            favID: res.fav_id
          })
        }
      })
    }

  },

  _getLocation(toLocation){
    return api.getLocation({type: 'gcj02'})
    .then(myLocation=>{
      this.setData({
        hasLocationAuth: true
      });
      let from = {
        latitude: myLocation.latitude,
        longitude: myLocation.longitude
      };

      return qqmapsdk.calculateDistance({
        from,
        to: [{
          latitude: 39.9 + Math.random()/10,
          longitude: 116.2 + Math.random()/10
        }]
      })
    })
    .then(res=>{
      if(res.status===0){
        this.setData({
          distance: res.result.elements[0].distance
        })
      }
    })
    .catch(e=>{
      if(e.errMsg==='getLocation:fail auth deny'){
        this.setData({
          hasLocationAuth: false
        })
      }

      if(e.status===373){
        this.setData({
          distance: -1
        })
      }
    })

  },

  onTapFav(){
    let userInfo = wx.getStorageSync('userInfo');

    if(!userInfo){
      wx.navigateTo({url:'/pages/login/index'});
      return;
    }

    let {openId} = userInfo;

    let {favID, shopID} = this.data;

    if(favID){
      req.delFav({
        open_id: openId,
        article_id: shopID,
        fav_id: favID
      })
      .then(res=>{
        if(res.code===0){
          this.setData({
            favID: ''
          })
        }
      })
    }else{
      req.addFav({
        open_id: openId,
        article_id: shopID
      })
      .then(res=>{
        if(res.code===0){
          this.setData({
            favID: res.fav_id
          })
        }
      })
    }

  }

})
