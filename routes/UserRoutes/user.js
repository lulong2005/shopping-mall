var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var passport = require('passport');
var multer  = require('multer');
var csrfProtection = csrf({cookie:true});
router.use(csrfProtection);

var brandController = require('../../controllers/brandController');
var categoryController = require('../../controllers/categoryController');

var userController = require('../../controllers/userController');
var token = 'iD3dGVcp-SVPr1GFkWRaXlwnqG4EIUQ70kOU';
/*Upload file*/

const crypto = require('crypto');
var path = require('path')
var fs = require('fs');

router.get('/verify/:id',userController.user_verification_get_member);

router.get('/signup', csrfProtection,function(req, res, next) {
	var messages = req.flash('error');
	brandController.get_list_brands(function(err, brands) {
			categoryController.get_list_categories(function(err, categories) {
				var productID = [];
				productID=req.session.productID || [];
				var items = 0;
				if (productID.length > 0)
					items = productID.length;
				res.render('UserView/signup',{
					title: 'Shopping Mall',
					brands: brands,
					categories: categories,
					csrfToken: req.csrfToken(),
					messages: messages, hasErrors: messages.length > 0,
					items: items,
					layout: 'UserView/layout'
				});
			});
	});
  
});
router.post('/signup',csrfProtection, passport.authenticate('local.signupmember',{
	successRedirect: '/',
	failureRedirect: '/user/signup',
	failureFlash: true
}));

router.get('/signin',notLoggedIn,csrfProtection, function(req, res, next) {
	var messages = req.flash('error');
	 brandController.get_list_brands(function(err, brands) {
			categoryController.get_list_categories(function(err, categories) {
				var productID = [];
				productID=req.session.productID || [];
				var items = 0;
				if (productID.length > 0)
					items = productID.length;
	res.render('UserView/signin',{
		title: 'Shopping Mall',
		brands: brands,
		categories: categories,
		csrfToken: req.csrfToken(),
		messages: messages,
		hasErrors: messages.length > 0,
		items: items,
		layout: 'UserView/layout'
	});
	});
	});
  
});
router.post('/signin',csrfProtection, passport.authenticate('local.signin',{
	successRedirect: '/',
	failureRedirect: '/user/signin',
	failureFlash: true
}));

router.get('/logout',csrfProtection,isLoggedIn, function(req, res, next){
	req.logout();
	req.session.destroy();
	res.redirect('/');
});

router.get('/profile',csrfProtection, isLoggedIn, function(req, res, next){
	var userProfile = req.user;
     brandController.get_list_brands(function(err, brands) {
			categoryController.get_list_categories(function(err, categories) {
				var productID = [];
				productID=req.session.productID || [];
				var items = 0;
				if (productID.length > 0)
					items = productID.length;
				res.render('UserView/profile', {
					title: 'Shopping Mall',
					brands: brands,
					categories: categories,
					csrfToken: req.csrfToken(),
					userProfile: userProfile,
					items: items,
					layout: 'UserView/layout'
				});
			});
	});
});

var storage = multer.diskStorage({
    destination: function (req,file,cb) {
        cb(null,'public/upload/avatar');
    },
    filename: function (req,file,cb) {
        crypto.pseudoRandomBytes(16, function (err, raw) {
            if (err) {
                return cb(err);
            }
            cb(null, raw.toString('hex') + path.extname(file.originalname));
        });
    }

});
var upload = multer({ storage: storage });

router.post('/profile',upload.single('avatarimg'),csrfProtection,isLoggedIn,userController.user_edit_info_post_member);

router.get('/forgetpassword',notLoggedIn,userController.user_forget_password_get_member);
router.post('/forgetpassword',userController.user_forget_password_post_member);
router.get('/resetpassword/:id',userController.user_reset_password_get_member);
router.post('/resetpassword/:id',userController.user_reset_password_post_member);

module.exports = router;

function isLoggedIn(req, res, next){
	if (req.isAuthenticated()){
        console.log(req.user.role);
		return next();
	}

	res.redirect('/');
}
function notLoggedIn(req, res, next){
	if (!req.isAuthenticated()){
		return next();
	}
	res.redirect('/');
}