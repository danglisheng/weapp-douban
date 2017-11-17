var app = getApp();

var util=require("../../../utils/utils.js");
Page({

    /**
     * 页面的初始数据
     */
    data: {
        navigationBarTitle:"",
        movies:{},
        totalCount:0,
        requestUrl:"",
        isEmpty:true,
        canRequest:true
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        
        var category = options.category;
        this.setData({ navigationBarTitle: category });
        var dataUrl = "";
        var readyData = {data:'ini'};
        switch (category) {
            case "正在热映":
                var dataUrl = app.globalData.doubanBase +
                    "/v2/movie/in_theaters";
               
                break;
            case "即将上映":
                var dataUrl = app.globalData.doubanBase +
                    "/v2/movie/coming_soon";
                
                break;
            case "豆瓣Top250":
                var dataUrl = app.globalData.doubanBase +
                    "/v2/movie/top250";
               
                break;
        }
        this.setData({requestUrl:dataUrl,totalCount:20});
        util.http(dataUrl, this.processDoubanData)

    },
    processDoubanData:function(fail,data){
        if(fail){
            this.setData({canRequest:true});
            return;
        }
        var movies = [];
        for (var idx in data.subjects) {
            var subject = data.subjects[idx];
            var title = subject.title;
            if (title.length >= 6) {
                title = title.substring(0, 6) + '...';
            }
            var temp = {
                stars: util.convertToStarsArray(subject.rating.stars),
                title: title,
                average: subject.rating.average,
                coverageUrl: subject.images.large,
                movieId: subject.id

            }
            movies.push(temp);
        }
        var totalMovies=[];
        if(this.data.isEmpty){
            this.setData({ movies: movies});
            this.setData({isEmpty:false});
        }
        else{
            totalMovies=this.data.movies.concat(movies);
            this.setData({movies:totalMovies});
        }
       this.data.totalCount+=20;
       this.setData({ totalCount: this.data.totalCount,canRequest:true});
       wx.hideNavigationBarLoading();
       wx.stopPullDownRefresh();
    },
    onScrollLower:function(event){
        
        var nextUrl=this.data.requestUrl+"?start="+this.data.totalCount+"&count=20";
        if(this.data.canRequest)
        {
            this.setData({ canRequest: false });
            util.http(nextUrl,this.processDoubanData);
            wx.showNavigationBarLoading();
            
        }
    },
    onPullDownRefresh:function(event){
        var refreshUrl=this.data.requestUrl+"?start=0&count=20";
        this.setData({isEmpty:true});
        this.setData({ totalCount: 0})
        util.http(refreshUrl,this.processDoubanData);
        wx.showNavigationBarLoading();
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        wx.setNavigationBarTitle({
            title: this.data.navigationBarTitle,
        })
    },
    onMovieTap: function (event) {
        var movieId = event.currentTarget.dataset.movieid;
        wx.navigateTo({
            url: '../movie-detail/movie-detail?id=' + movieId
        })
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