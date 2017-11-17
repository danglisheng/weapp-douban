// pages/post/book-detail/book-detail.js
var app=getApp();
var util=require('../../../utils/utils.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bookdetail:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var bookid=options.id;
    var title=options.title;
    wx.setNavigationBarTitle({
        title: title,
    })
    var queryUrl = app.globalData.doubanBase +'/v2/book/'+bookid;
    
    util.http(queryUrl,this.processData)
  },
  processData:function(error,queryResult){
    if(error){
        console.log(error);
        return;
    }
   
    var tmp = util.getBookObject(queryResult);
    tmp.summary=queryResult.summary;
    tmp.author_intro=queryResult.author_intro;
    tmp.catalog = queryResult.catalog;
    this.setData({bookdetail:tmp});
  }

 
})