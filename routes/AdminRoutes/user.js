var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var passport = require('passport');
var multer  = require('multer');
var csrfProtection = csrf({cookie:true});
router.use(csrfProtection);

var userController = require('../../controllers/userController');
var token = 'iD3dGVcp-SVPr1GFkWRaXlwnqG4EIUQ70kOU';
/*Upload file*/

const crypto = require('crypto');
var path = require('path')
var fs = require('fs');


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

router.get('/verify/:id',userController.user_verification_get);
router.get('/forgetpassword',userController.user_forget_password_get);
router.post('/forgetpassword',userController.user_forget_password_post);
router.get('/resetpassword/:id',userController.user_reset_password_get);
router.post('/resetpassword/:id',userController.user_reset_password_post);


router.get('/profile',csrfProtection, LoginAsAdmin, function(req, res, next){
	var userProfile = req.user;
    //var messages = req.flash('error');
    //console.log(messages);
	res.render('AdminView/profile', {
		title: 'Admin Shopping Mall',
		csrfToken: req.csrfToken(),
		userProfile: userProfile,
		layout: 'AdminView/layout'
	});
});

router.post('/profile',upload.single('avatarimg'),csrfProtection,LoginAsAdmin,userController.user_edit_info_post);
router.get('/members',LoginAsAdmin,userController.user_list_get);
router.post('/members',LoginAsAdmin,userController.user_list_post);
router.get('/members/edit/:id',LoginAsAdmin,userController.user_edit_info_mem_get);
router.post('/members/edit/:id',LoginAsAdmin,userController.user_edit_info_mem_post);
router.get('/members/delete',LoginAsAdmin,userController.user_delete_mem_get);
router.post('/members/delete',LoginAsAdmin,userController.user_delete_mem_post);

router.get('/logout',csrfProtection,isLoggedIn, function(req, res, next){
	req.logout();
	req.session.destroy();
	res.redirect('/');
});

router.use('/', notLoggedIn, function(req, res, next){
	next();
});

router.get('/signup', csrfProtection,function(req, res, next) {
	var messages = req.flash('error');
	res.render('AdminView/signup',{
		title: 'Admin Shopping Mall',
		csrfToken: req.csrfToken(),
		messages: messages, hasErrors: messages.length > 0,
		layout: 'AdminView/layout'
	});
  
});
router.post('/signup',csrfProtection, passport.authenticate('local.signup',{
	successRedirect: '/admin/signin',
	failureRedirect: '/admin/signup',
	failureFlash: true
}));

router.get('/signin',csrfProtection, function(req, res, next) {
	var messages = req.flash('error');
	 
	res.render('AdminView/signin',{
		title: 'Admin Shopping Mall',
		csrfToken: req.csrfToken(),
		messages: messages,
		hasErrors: messages.length > 0,
		layout: 'AdminView/layout'
	});
  
});
router.post('/signin',csrfProtection, passport.authenticate('local.signin',{
	successRedirect: '/admin/profile',
	failureRedirect: '/admin/signin',
	failureFlash: true
}));

module.exports = router;

function isLoggedIn(req, res, next){
	if (req.isAuthenticated()){
        console.log(req.user.role);
		return next();
	}

	res.redirect('/');
}
function LoginAsAdmin(req, res, next){
	//console.log(req.user.role);
    if (req.isAuthenticated()){
        console.log(req.user.role);
        if (req.user.role == 'admin'){
        	return next();
		}
		else
		{
			res.send(403);
		}
        //return next();
    }

    res.redirect('/');
}



function notLoggedIn(req, res, next){
	if (!req.isAuthenticated()){
		return next();
	}
	res.redirect('/');
}