const api = require('../../helper/apis');

const cityData = require('./cityData');


const qqmap = api.createQQMap();

Page({
  posArrInfo: [],
  /**
   * 页面的初始数据
   */
  data: {
    cityData,
    scrollToID: '',
    locateCity: '--',
    hasAuthLocation: true,
    historyCity: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  onShow(){
    this._getLocation();

    let historyCity = wx.getStorageSync('historyCity');

    if(historyCity){
      this.setData({historyCity})
    }
  },

  onReady(){
    wx.createSelectorQuery()
    .selectAll('.sel-item')
    .boundingClientRect(rects=>{
      this.posArrInfo = rects.map(elt=>{
        return {
          top: elt.top,
          bottom: elt.bottom,
          id: elt.id
        }
      });
    })
    .exec();
  },

  _getLocation(){
    api.getLocation({type: 'gcj02'})
    .then(res=>qqmap.reverseGeocoder({
      location: {
        latitude: res.latitude,
        longitude: res.longitude
      }
    }))
    .then(res=>{
      let {city} = res.result.address_component;
      this.setData({
        locateCity: city,
        hasAuthLocation: true
      })
    })
    .catch(e=>{
      if(e.errMsg === 'getLocation:fail auth deny'){
        this.setData({
          hasAuthLocation: false
        })
      }
    })
  },

  onLetterTap({target}){
    if(target.dataset.type !== 'fastCheck') return;

    this.currentID = target.id;
    this.setData({
      scrollToID: `city-to-${target.id}`
    });

  },

  onLetterTouchMove(ev){
    let {clientY} = ev.touches[0];
    let letter = this.posArrInfo.find(elt=>{
      return clientY > elt.top && clientY < elt.bottom;
    });

    if(letter && this.currentID!==letter.id){
      this.currentID = letter.id;
      console.log(letter);
      this.setData({
        scrollToID: `city-to-${letter.id}`
      })
    }
  },

  onSelectCity({target}){
    let {name} = target.dataset;
    if(!name) return;

    let {historyCity} = this.data;

    let filterCitys = historyCity.filter(elt=>elt!==name);

    let citys = [
      name,
      ...filterCitys
    ];

    wx.setStorageSync('historyCity', citys.slice(0,3));

    wx.setStorageSync('curtCity', name);

    wx.navigateBack();

  }


})
