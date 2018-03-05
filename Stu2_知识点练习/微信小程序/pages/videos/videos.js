// pages/videos/videos.js
var app=getApp();
var utils=require("../../utils/utils.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inTheaters:[],
    comingSoon: [],
    top250: [],
    searchResult:[],
    searchPanelShow: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var inTheaters = app.globalData.doubanBase + '/v2/movie/in_theaters?start=0&count=3',
      comingSoon = app.globalData.doubanBase + '/v2/movie/coming_soon?start=0&count=3',
      top250 = app.globalData.doubanBase + '/v2/movie/top250?start=0&count=3';
    this.GetVideoListData("inTheaters",inTheaters);
    this.GetVideoListData("comingSoon",comingSoon);
    this.GetVideoListData("top250",top250);
  },
  GetVideoListData:function(index,url){
    var that=this;
    wx.request({
      url: url,
      data: {},
      method: "GET",
      header: {
        "content-type": "application/json"
      },
      success: function (res) {
        if (res.data && res.data.subjects){
          var obj={};
          obj[index] = [];
          res.data.subjects.forEach(function(v,i){
            var temp={};
            temp.title = v.title.length>6?v.title.substring(0,6)+"...":v.title;
            temp.image=v.images.large;
            temp.average = v.rating.average;
            temp.videoId = v.id;
            temp.stars = utils.convertToStarsArray(v.rating.stars);
            obj[index].push(temp);
          });
          that.setData(obj);
        }
      },
      fail: function () {
        console.log("fail");
      }
    });
  },
  MoreVideos:function(event){
    var category=event.currentTarget.dataset.category;
    wx.navigateTo({
      url: './more-videos/more-videos?category=' + category,
    });
  },
  onBindFocus:function(event){
    this.setData({
      searchPanelShow:true
    });
  },
  onBindChange:function(event){
    var text = event.detail.value;
    var searchUrl = app.globalData.doubanBase + "/v2/movie/search?q="+text;
    this.GetVideoListData("searchResult", searchUrl);
  },
  onCancelImgTap: function (event) {
    this.setData({
      searchPanelShow: false
    });
  },
  onVideoTap: utils.onVideoTap
})