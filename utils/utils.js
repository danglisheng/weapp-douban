function convertToStarsArray(stars) {
    var num = stars.toString().substring(0, 1);
    var array = [];
    for (var i = 1; i <= 5; i++) {
        if (i <= num) {
            array.push(1);
        }
        else {
            array.push(0);
        }
    }
    return array;
}
function http(url, callBack) {
    wx.request({
        url: url,
        method: 'GET',
        header: {
            "Content-Type": 'application/xml'
        },
        success: function (res) {
            callBack(null, res.data);
        },
        fail: function (error) {
            callBack(error, null);
            console.log(error);
        }
    })
}
function getBookObject(booksInfo) {
    var temp = {
        title: booksInfo.title,
        surface_pic_url: booksInfo.image,
        author: booksInfo.author.join(','),
        average: booksInfo.rating.average,
        numRaters: booksInfo.rating.numRaters,
        summary: (booksInfo.summary.length > 60) ? booksInfo.summary.substring(0, 60) + '...' : booksInfo.summary,
        price: booksInfo.price,
        pubdate: booksInfo.pubdate,
        publisher: booksInfo.publisher,
        bookid: booksInfo.id
    }
    return temp;
}
module.exports = {
    convertToStarsArray: convertToStarsArray,

    http: http,
    getBookObject: getBookObject

}