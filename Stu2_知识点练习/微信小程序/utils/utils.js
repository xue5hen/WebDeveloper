module.exports={
  convertToStarsArray:function(stars){
    var num=stars.toString().substring(0,1);
    var array=[];
    for(var i=0;i<5;i++){
      if(i<num){
        array.push(1);
      }else{
        array.push(0);
      }
    }
    return array;
  },
  convertToCastString: function(casts) {
    var castsjoin = "";
    for (var idx in casts) {
      castsjoin = castsjoin + casts[idx].name + " / ";
    }
    return castsjoin.substring(0, castsjoin.length - 2);
  },
  convertToCastInfos:function (casts) {
    var castsArray = []
    for (var idx in casts) {
      var cast = {
        img: casts[idx].avatars ? casts[idx].avatars.large : "",
        name: casts[idx].name
      }
      castsArray.push(cast);
    }
    return castsArray;
  },
  http: function (url, callback) {
    wx.request({
      url: url,
      method: "GET",
      header: {
        "content-type": "application/json"
      },
      success: function (res) {
        callback(res.data);
      },
      fail: function (error) {
        console.log(error);
      }
    });
  },
  onVideoTap:function(event){
    var videoId=event.currentTarget.dataset.videoId;
    wx.navigateTo({
      url: '/pages/videos/video-detail/video-detail?videoId=' + videoId
    });
  }
}