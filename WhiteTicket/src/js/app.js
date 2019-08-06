var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index.js');
var ticketproductRouter = require('././routes/ticketproduct.js');
var ticketbookingRouter = require('./routes/ticketbooking.js');
var signupRouter = require('./routes/signup.js');
var noticewriteRouter = require('./routes/noticewrite.js');
var noticelistRouter = require('./routes/noticelist.js');
var goodsproductRouter = require('./routes/goodsproduct.js');
var androidRouter = require('./routes/android.js');
//var reserveRouter = require('./routes/reserve');
var dapp = express();
/*
const http = require('http');
const hostname = '127.0.0.1';
const port = 3000;
http.createServer((req,res)=>{
  res.writeHead(200,{'Content-Type':'text/plain'});
  res.render('index');  
}).listen(port,hostname,()=>{
  console.log('Server running');
})
*/
// view engine setup


dapp.set('views', path.join(__dirname, 'src'));
dapp.set('view engine', 'ejs');
dapp.engine('html',require('ejs').renderFile); // for html code

dapp.use(logger('dev'));
dapp.use(express.json());
dapp.use(express.urlencoded({ extended: false }));
dapp.use(cookieParser());
dapp.use(express.static(path.join(__dirname, 'src')));

dapp.use('/', indexRouter);
dapp.use('/',ticketproductRouter);
dapp.use('/',ticketbookingRouter);
dapp.use('/',signupRouter);
dapp.use('/',noticewriteRouter);
dapp.use('/',noticelistRouter);
dapp.use('/',goodsproductRouter);
dapp.use('/',androidRouter);


//dapp.use('/reserve', reserveRouter);

// catch 404 and forward to error handler
/*
dapp.use(function(req, res, next) {
  next(createError(404));
});
*/

// error handler
dapp.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.dapp.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = dapp;


