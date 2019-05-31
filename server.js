var express = require('express')
var bodyParser = require("body-parser"); 
var app = express()
var path = require('path')
var cheerio = require('cheerio');
var http = require('https');

app.use(bodyParser.urlencoded({ extended: false }));  
app.use(express.static(__dirname + '/res'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.get('/' , function(req,res){
    res.render('search');
});

app.get('/result' , function(req,res){
  
});

app.post('/search', function(req, res) {
  var para = req.body.search;
  var mangas = [];
  var m = res;
  var url = 'https://www.manhuafen.com/search/?keywords='+encodeURI(para);
  console.log(url);
  
  http.get(url, function(res){
    var chunks = [];
    var size = 0;
    res.on('data', function(chunk){
        chunks.push(chunk);
        size += chunk.length;
    });
    
    res.on('end', function(){
        var data = Buffer.concat(chunks, size);
        var html = data.toString();
        var $ = cheerio.load(html);
        
        $("li.list-comic").each( function(){
            var manga = {};
            manga.pic = $(this).find("img").attr("src");
            manga.name = $(this).find("a.image-link").attr("title");
            manga.link = $(this).find("a.image-link").attr("href");
            mangas.push(manga);
            // console.log(manga);
        });
        m.render('result', {mangas:mangas});
        
    });
    
  });
});
var server = app.listen(3000, function () {
 
    var host = server.address().address;
    var port = server.address().port;
   
    console.log("应用实例，访问地址为 http://%s:%s", host, port);
   
  })