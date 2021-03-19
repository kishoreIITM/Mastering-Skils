var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');
const passport = require('passport');
require('./authenticate');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var mathRouter = require('./routes/math');
var phyRouter = require('./routes/phy');
var chemRouter = require('./routes/chem');
var app = express();
app.use(passport.initialize());
app.all('*',(req,res,next)=>{
  if(req.secure){
    next()
  }
  else{
    res.redirect('https://localhost:3443');
  }
})


const url = "mongodb+srv://kishore:MfmqdzsSD3XDrQL@cluster0.chf4z.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const connect = mongoose.connect(url,{
  useNewUrlParser:true,
  useUnifiedTopology:true
});
connect.then(()=>{
  console.log("Connected to database");
})
.catch((err)=>{
  console.log(err)
})
mongoose.set("useCreateIndex",true);
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/math',mathRouter);
app.use('/physics',phyRouter);
app.use('/chemistry',chemRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error',{error:err,message:err.message});
});

module.exports = app;
