var passport = require('passport');
var User = require ('../models/user');
var async = require('async');
var LocalStrategy = require('passport-local').Strategy;

var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');

var transport = nodemailer.createTransport(smtpTransport({
    service: 'gmail',
    secureConnection: false,
    auth: {
        user: 'littleprincess.itus2014@gmail.com',
        pass: 'itus2014'
    }

}));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});



passport.use('local.signup', new LocalStrategy({
	usernameField: 'email',
	passwordField: 'password',
	passReqToCallback: true
}, function(req,email, password, done){
	req.checkBody('email', 'Email is require').notEmpty();
    req.checkBody('email', 'Invalid Email!').isEmail();
	req.checkBody('password', 'Password minimum length is 6').isLength({min:6});
    req.checkBody('password', 'Password is required').notEmpty();
   // req.checkBody("password", "Password must include one lowercase character, one uppercase character, a number, and a special character.").matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/, "i");
	req.checkBody('name','Full name is required').notEmpty();
	req.checkBody('passwordretype','Retyping password is require').notEmpty();
	req.checkBody('passwordretype','Password do not match').equals(req.body.password);
	var errors = req.validationErrors();
	if (errors){
		var messages = [];
		errors.forEach(function(error){
			messages.push(error.msg);
		});
		return done(null, false, req.flash('error', messages));
	}
	User.findOne({'email': email}, function(err, user){
		if (err){
			return done(err);
		}
		if (user){
			return done(null, false, {message: 'Email is already in use!'});
		}
		var newUser = new User();
		newUser.email = email;
		newUser.password = newUser.encryptPassword(password);
		newUser.name = req.body.name;
		newUser.role = "member";
		newUser.active = false;
		newUser.avatar = "/upload/avatar/default.png";
		newUser.save(function(err, result){
			if (err){
				return done(err);
			}
			//req.logout();
			console.log(result);
            var sendmail;

			SendVerificationMail(req,result);
			sendmail = 'Email verification is sent to '+email;
			return done(null, false, {success: sendmail});
		});
	});
}));

passport.use('local.signin', new LocalStrategy({
	usernameField: 'email',
	passwordField: 'password',
	passReqToCallback: true
}, function(req, email, password, done){
	req.checkBody('email', 'Invalid Email!').notEmpty().isEmail();
	req.checkBody('password', 'Invalid Password!').notEmpty();
	var errors = req.validationErrors();
	if (errors){
		var messages = [];
		errors.forEach(function(error){
			messages.push(error.msg);
		});
		return done(null, false, req.flash('error', messages));
	}
	User.findOne({'email': email}, function(err, user){
		if (err){
			return done(err);
		}
		if (!user){
			return done(null, false, {message: 'No user found!'});
		}
		if (!user.validPassword(password)){
			return done(null, false, {message: 'Wrong password!'});
		}
		if (user.active == false || user.active == undefined || user.active == '')
		{
			return done(null, false, {message: 'User is not active'});
		}
		return done(null,  user);
	});
}));

function SendVerificationMail(req,user) {
    var host=req.get('host');
    var link="http://"+req.get('host')+"/admin/verify/"+user["_id"];
    var mailOptions={
        to : user["email"],
        subject : "Please confirm your account",
        html : "Hello,<br> Please Click on the link to verify your email.<br><a href="+link+">Click here to verify</a>"
    }
    console.log(mailOptions);
    transport.sendMail((mailOptions),function(error, response){
        if(error){
            console.log(error);
            //res.end("error");
           // return false;
        }
        else{
            console.log("Message sent: " + response.message);
            console.log("success");
            //res.end("sent");
            //return true;
        }
    });
}

passport.use('local.signupmember', new LocalStrategy({
	usernameField: 'email',
	passwordField: 'password',
	passReqToCallback: true
}, function(req,email, password, done){
	req.checkBody('email', 'Email is require').notEmpty();
    req.checkBody('email', 'Invalid Email!').isEmail();
	req.checkBody('password', 'Password minimum length is 6').isLength({min:6});
    req.checkBody('password', 'Password is required').notEmpty();
   // req.checkBody("password", "Password must include one lowercase character, one uppercase character, a number, and a special character.").matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/, "i");
	req.checkBody('name','Full name is required').notEmpty();
	req.checkBody('passwordretype','Retyping password is require').notEmpty();
	req.checkBody('passwordretype','Password do not match').equals(req.body.password);
	var errors = req.validationErrors();
	if (errors){
		var messages = [];
		errors.forEach(function(error){
			messages.push(error.msg);
		});
		return done(null, false, req.flash('error', messages));
	}
	User.findOne({'email': email}, function(err, user){
		if (err){
			return done(err);
		}
		if (user){
			return done(null, false, {message: 'Email is already in use!'});
		}
		var newUser = new User();
		newUser.email = email;
		newUser.password = newUser.encryptPassword(password);
		newUser.name = req.body.name;
		newUser.role = "member";
		newUser.active = false;
		newUser.avatar = "http://acsicanadabooks.com/sites/acsiwest.org/files/Membership%20Icon%20I.jpg";
		newUser.save(function(err, result){
			if (err){
				return done(err);
			}
			//req.logout();
			console.log(result);
            var sendmail;

			SendVerificationMailMember(req,result);
			sendmail = 'Email verification is sent to '+email;
			return done(null, false, {success: sendmail});
		});
	});
}));

function SendVerificationMailMember(req,user) {
    var host=req.get('host');
    var link="http://"+req.get('host')+"/user/verify/"+user["_id"];
    var mailOptions={
        to : user["email"],
        subject : "Please confirm your account",
        html : "Hello,<br> Please Click on the link to verify your email.<br><a href="+link+">Click here to verify</a>"
    }
    console.log(mailOptions);
    transport.sendMail((mailOptions),function(error, response){
        if(error){
            console.log(error);
            //res.end("error");
           // return false;
        }
        else{
            console.log("Message sent: " + response.message);
            console.log("success");
            //res.end("sent");
            //return true;
        }
    });
}