var app = getApp();
var util=require("../../utils/utils.js");
Page({
    data:{
        inTheaters:{},
        comingSoon:{},
        top250:{},
        searchResult:{},
        containerShow:true,
        searchPanelShow:false
    },
    onLoad: function (e) {
        var doubanBase = app.globalData.doubanBase;
        var inTheatersUrl = doubanBase + "/v2/movie/in_theaters" + "?start=0&count=3";
        var comingSoonUrl = doubanBase + "/v2/movie/coming_soon" + "?start=0&count=3";
        var top250Url = doubanBase + "/v2/movie/top250" + "?start=0&count=3";
        this.getMovieListData(inTheatersUrl,"inTheaters",'正在热映');
        this.getMovieListData(comingSoonUrl,"comingSoon",'即将上映');
        this.getMovieListData(top250Url,"top250",'豆瓣Top250');
    },
    onMoreTap:function(e){
        var category=e.currentTarget.dataset.category;
        
        wx.navigateTo(
            {
                url:'more-movie/more-movie?category='+category,
            }
        )
    },
    onMovieTap: function (event) {
        var movieId=event.currentTarget.dataset.movieid;
        wx.navigateTo({
            url:"movie-detail/movie-detail?id="+movieId
        })
    },
    getMovieListData: function (url,settedKey,categoryTitle) {
        var that = this;
        wx.request({
            url: url,
            method: 'GET',
            header: {
                'Content-type': 'application/xml'
            },
            success: function (res) {
                
                that.processDoubanData(res.data, settedKey, categoryTitle);
            },
            fail: function () {
                console.log('failed');
            }
        })
    },
    processDoubanData: function (moviesDouban, settedKey, categoryTitle) {
        var movies = [];
        for (var idx in moviesDouban.subjects) {
            var subject = moviesDouban.subjects[idx];
            var title = subject.title;
            if (title.length >= 6) {
                title = title.substring(0, 6) + '...';
            }
            var temp = {
                stars:util.convertToStarsArray(subject.rating.stars),
                title: title,
                average: subject.rating.average,
                coverageUrl: subject.images.large,
                movieId: subject.id,
                movietype:settedKey

            }
            movies.push(temp);
        }
        var readyData={};
        readyData[settedKey] = { movies: movies, categoryTitle: categoryTitle};
        this.setData(readyData);
        
    },
    onBindFocus:function(event){
        this.setData({containerShow:false,searchPanelShow:true});
       
    },
    onBindChange:function(event){
       var text=event.detail.value;
       var searchUrl = app.globalData.doubanBase +"/v2/movie/search?q="+text;
       this.getMovieListData(searchUrl,'searchResult','');
    },
    returnToHome:function(event){
        this.setData({ containerShow: true, searchPanelShow: false, searchResult:{}});
    }
})