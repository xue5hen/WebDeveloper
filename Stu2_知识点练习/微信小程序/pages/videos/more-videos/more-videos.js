var app = getApp();
var utils = require("../../../utils/utils.js");
Page({
  data: {
    navigateTitle:"",
    dataUrl:"",
    videos:[],
    totalCount:0,
    isLoading:false
  },
  onLoad: function (options) {
    var category = options.category;
    this.setData({
      navigateTitle: category
    });
    switch (category){
      case "正在热映":
        var dataUrl = app.globalData.doubanBase + '/v2/movie/in_theaters';
        break;
      case "即将上映":
        var dataUrl = app.globalData.doubanBase + '/v2/movie/coming_soon';
        break;
      case "TOP250":
        var dataUrl = app.globalData.doubanBase + '/v2/movie/top250';
        break;
    }
    utils.http(dataUrl, this.processDoubanData);
    this.setData({
      dataUrl: dataUrl
    });
  },
  onReady: function (event){
    wx.setNavigationBarTitle({
      title: this.data.navigateTitle,
    });
  },
  processDoubanData:function(data){
    var videos = [];
    data.subjects.forEach(function (v, i) {
      var temp = {};
      temp.title = v.title.length > 6 ? v.title.substring(0, 6) + "..." : v.title;
      temp.image = v.images.large;
      temp.average = v.rating.average;
      temp.videoId = v.id;
      temp.stars = utils.convertToStarsArray(v.rating.stars);
      videos.push(temp);
    });
    var totalVideos=this.data.videos.concat(videos);
    this.setData({
      videos: totalVideos
    });
    this.data.totalCount+=20;
    wx.hideNavigationBarLoading();
    wx.stopPullDownRefresh();
    this.data.isLoading = false;
  },
  onReachBottom: function (event) {
    if (!this.data.isLoading){
      var nextUrl = this.data.dataUrl + "?start=" + this.data.totalCount + "&count=20";
      utils.http(nextUrl, this.processDoubanData);
      this.data.isLoading=true;
      wx.showNavigationBarLoading();
    }
  },
  onPullDownRefresh:function(){
    if (!this.data.isLoading) {
      var refreshUrl = this.data.dataUrl + "?start=0&count=20";
      this.data.totalCount = 0;
      this.data.videos = [];
      utils.http(refreshUrl, this.processDoubanData);
      this.data.isLoading = true;
    }
  },
  onVideoTap: utils.onVideoTap
})