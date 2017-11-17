
var app=getApp();
var util=require('../../utils/utils.js');
Page({
	data: {
        booksid:[
            20427187, 1007305, 1020587
        ],
        books:[],
        searchResults:[],
        isSearch:false
	},
    onBindBlur:function(event){
        var queryText=event.detail.value;
        if(!queryText){
            return;
        }
        this.setData({isSearch:true});
        var queryUrl = app.globalData.doubanBase +"/v2/book/search"+"?q="+queryText;
        
        util.http(queryUrl, this.analysisQueryResult);

    },
    returnHome:function(event){
        this.setData({isSearch:false,searchResults:[]});
    },
    analysisQueryResult:function(error,result){
        if(error){
            console.log(error);
            return;
        }
        var books=result.books;
        var searchResults = this.data.searchResults;
        for(var idx in books){
            var book=books[idx];
            var tmp=util.getBookObject(book);
            searchResults.push(tmp);
        }
        this.setData({searchResults:searchResults});
    },
    processData:function(error,booksInfo){
        if(error){
            return;
        }
       
        var temp = util.getBookObject(booksInfo);
        var books=this.data.books;
        books.push(temp)
        this.setData({books:books});
    },
    bookDetail:function(event){
        var bookid=event.currentTarget.dataset.id;
        var title = event.currentTarget.dataset.title;
        wx.navigateTo({
            url: './book-detail/book-detail?id='+bookid+"&title="+title,
        })
    },
	

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {

		
        var booksid = this.data.booksid;
        for(var idx in booksid){
            var bookinfoUrl = app.globalData.doubanBase + "/v2/book/" + booksid[idx];
            util.http(bookinfoUrl, this.processData);
        }
        

	}



})