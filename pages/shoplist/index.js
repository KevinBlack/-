const req = require('../../helper/req');


Page({

  rows: 6,

  /**
   * 页面的初始数据
   */
  data: {
    shoplist: [],
    isListLoading: false,
    isLoadedAll: false,
    page: 2,
    distance: '500',
    sort: 'distance',
    filterType: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (query) {
    this.category_id = query.id;

    let {distance, sort} = this.data;

    req.getShops({
      category_id: query.id,
      distance,
      sort
    }, {
      page: 1,
      rows: this.rows
    })
    .then(res=>{
      if(!res.error){
        this.setData({
          shoplist: res
        })
      }
    })
  },

  onReachBottom(){

    let {page, shoplist, isListLoading, isLoadedAll, distance, sort} = this.data;

    if(isListLoading || isLoadedAll) return ;

    let {category_id} = this;

    this.setData({
      isListLoading: true
    })

    req.getShops({
      category_id,
      distance,
      sort
    }, {
      page: page,
      rows: this.rows
    })
    .then(res=>{
      if(res.length){
        this.setData({
          shoplist: [...shoplist, ...res],
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
  },

  onSelectTap(event){
    let {type} = event.target.dataset;

    if(this.data.filterType===type){
      this.setData({
        filterType: ''
      })
    }else{
      this.setData({
        filterType: type
      })
    }


  },

  onValueTap(event){
    let {type} = event.currentTarget.dataset;
    let {value} = event.target.dataset;

    if(type==='range'){
      this.setData({
        distance: value
      })
    }
    if(type==='sort'){
      this.setData({
        sort: value
      })
    }

    req.getShops({
      category_id: this.category_id,
      distance: this.data.distance,
      sort: this.data.sort
    }, {
      page: 1,
      rows: this.rows
    })
    .then(res=>{
      if(res.length){
        this.setData({
          shoplist: [...res],
          page: 2,
          filterType: '',
          isLoadedAll: false
        })
      }
    })


  }

})
