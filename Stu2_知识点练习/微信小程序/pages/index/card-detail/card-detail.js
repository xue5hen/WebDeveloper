var localdb=require("../../../data/localdb.js");
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cardId:-1,
    collected:false,
    isPlayingMusic:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var data=localdb.cardList[options.id];
    this.setData(data);
    this.setData({ cardId: options.id});
    var cardCollected = wx.getStorageSync("cardCollected");
    if (cardCollected){
      this.setData({ collected: cardCollected[options.id]});
    }else{
      var cardCollected={};
      cardCollected[options.id]=false;
      wx.setStorageSync('cardCollected', cardCollected);
    }
    if (app.globalData.g_isPlayingMusic && app.globalData.g_MusicId === this.data.cardId) {
      this.setData({ isPlayingMusic: true });
    }
    this.SetMusicMonitor();
  },
  SetMusicMonitor:function(){
    var that = this;
    wx.onBackgroundAudioPlay(function () {
      that.setData({ isPlayingMusic: true });
      app.globalData.g_isPlayingMusic = true;
    });
    wx.onBackgroundAudioPause(function () {
      that.setData({ isPlayingMusic: false });
      app.globalData.g_isPlayingMusic = false;
    });
    wx.onBackgroundAudioStop(function () {
      that.setData({ isPlayingMusic: false });
      app.globalData.g_isPlayingMusic = false;
    });
  },
  MusicControl:function(){
    var isPlayingMusic = this.data.isPlayingMusic;
    if (isPlayingMusic){
      wx.pauseBackgroundAudio();
      this.setData({ isPlayingMusic:false});
      app.globalData.g_isPlayingMusic=false;
    }else{
      wx.playBackgroundAudio(localdb.cardList[this.data.cardId].music);
      this.setData({ isPlayingMusic: true });
      app.globalData.g_isPlayingMusic = true;
    }
    app.globalData.g_MusicId = this.data.cardId;
  },
  Collect:function(){
    var collected = !this.data.collected;
    var cardCollected = wx.getStorageSync("cardCollected") || {};
    cardCollected[this.data.cardId] = collected;
    this.ShowToast(cardCollected, collected);
  },
  Share:function(){
    var itemList= [
      "分享到微信好友",
      "分享到朋友圈",
      "分享到QQ",
      "分享到微博"
    ];
    wx.showActionSheet({
      itemList: itemList,
      itemColor:"#405f80",
      success:function(res){
        wx.showModal({
          title: '用户 ' + itemList[res.tapIndex],
          content: '抱歉，微信小程序暂不支持分享'
        });
      }
    })
  },
  ShowToast: function (cardCollected, collected){
    wx.setStorageSync("cardCollected", cardCollected);
    this.setData({ collected: collected });
    wx.showToast({
      title: collected?'收藏成功':"取消收藏",
      icon:"success",
      duration:1000
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})