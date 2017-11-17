// pages/movies/movie-detail/movie-detail.js
var app=getApp();
var util=require("../../../utils/utils.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    movieDetail:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var movieId=options.id;
    
    var moviedetailUrl = app.globalData.doubanBase +"/v2/movie/subject/"+movieId;
    util.http(moviedetailUrl,this.processData)
  },
  processData:function(fail,data){
        if(fail){
            return;
        }
        if(!data){
            return;
        }
        
       var temp={
           average:data.rating.average,
           stars: util.convertToStarsArray(data.rating.stars),
           likes_count:data.collect_count,
           comments_count: data.comments_count,
           title:data.title,
           directors:data.directors?this.getNamesFromArray(data.directors):'',
           casts: data.casts?this.getNamesFromArray(data.casts):'',
           genres:data.genres.join('、'),
           summary:(data.summary.length>90)?(data.summary.substring(0,90)+'...'):data.summary,
           year:data.year,
           countries:data.countries.join("/"),
           imgUrl:data.images.large,
           original_title: data.original_title,
           actors_img_url: data.casts?this.getImgsFromArray(data.casts):[]

       }

       this.setData(temp);
  },
  getNamesFromArray:function(array){
      if(!array){
          return;
      }
      var names=[];
      for(var index in array){
          
         names.push(array[index]["name"]);
      }
  
      return names.join('/');
     
  },
  getImgsFromArray:function(array){
      if (!array) {
          return;
      }
      var imgs=[];
      for(var index in array){
          if(!array[index].avatars){
              return;
          }
          imgs.push(array[index].avatars.large);
      }
      
      return imgs;
  }
  
})