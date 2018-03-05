var localdb = require("../../data/localdb.js");

Page({
  /**
   * 页面的初始数据
   */
  data: {
    slideList: [
      { img: '/images/slide/slide1.jpg', cardId: 0 },
      { img: '/images/slide/slide2.jpg', cardId: 1 },
      { img: '/images/slide/slide3.jpg', cardId: 2 },
      { img: '/images/slide/slide4.jpg', cardId: 3 }
    ],
    cardList: []
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      cardList: localdb.cardList
    });
  },
  ViewDetail: function (event) {
    var cardId = event.currentTarget.dataset.cardId;
    wx.navigateTo({
      url: './card-detail/card-detail?id=' + cardId
    });
  },
  SwiperViewDetail: function (event) {
    var cardId = event.target.dataset.cardId;
    wx.navigateTo({
      url: './card-detail/card-detail?id=' + cardId
    });
  }
})