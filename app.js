var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressHbs = require('express-handlebars');
var mongoose = require('mongoose');
var session = require('express-session');
var passport = require('passport');
var flash = require('connect-flash');
var validator = require('express-validator');


//var users = require('./routes/AdminRoutes/users');
//Admin
var index_admin = require('./routes/AdminRoutes/index');
var admin = require('./routes/AdminRoutes/user');
var products = require('./routes/AdminRoutes/products');
var add = require('./routes/AdminRoutes/add');
var order_admin = require('./routes/AdminRoutes/order');
//User
var viewproduct = require('./routes/UserRoutes/viewproduct');
var user = require('./routes/UserRoutes/user');
var order = require('./routes/UserRoutes/order');
var index = require('./routes/UserRoutes/index');
/////////////////////////////////////////////////
var app = express();


//mongoose.connect('localhost:27017/productapp');
mongoose.connect('mongodb://admin:admin@ds135552.mlab.com:35552/shopping-mall')
require('./config/passport');
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(validator());
app.use(cookieParser());
app.use(session({secret: 'mysupersecret', resave: false, saveUninitialized: false}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next){
	res.locals.login = req.isAuthenticated();
	next();
});

app.use('/', index);
app.use('/products', products);
app.use('/add',add);
//app.use('/users', users);
app.use('/admin', admin);
app.use('/viewproduct', viewproduct);
app.use('/user', user);
app.use('/order', order);
app.use('/adminpage',index_admin);
app.use('/order_list',order_admin);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('AdminView/error');
});

module.exports = app;
