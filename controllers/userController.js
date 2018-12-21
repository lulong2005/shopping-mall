/**
 * Created by musia on 20/06/2017.
 */
var User = require ('../models/user');
var brandController = require('./brandController');
var categoryController = require('./categoryController');
/* csrf = require('csurf');
var csrfProtection = csrf({cookie: true});*/
var bcrypt = require('bcrypt-nodejs');
var fs = require('fs');
//var mongoose = require('mongoose');
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

var rand;

exports.user_verification_get = function (req,res,next) {
    console.log(req.protocol+":/"+req.get('host'));
    User.findById(req.params.id).exec(function (err,user) {
        if(err){
            console.log(err);
            res.end("<h1>Error 404</h1>");
        }
        else
        {
            if (user != null && user !=undefined)
            {
                if (user.active == true){
                    res.redirect('/admin/signin');
                }
            }
            else
            {
                res.end("<h1>User can not be found</h1>");
            }
        }
    });
    var user_instance = new User();
    user_instance._id = req.params.id;
    user_instance.active = true;
    User.findByIdAndUpdate(req.params.id,user_instance,{}).exec(function (err,user) {
        if (err){
            res.end("<h1>Cannot find account</h1>");
        }
        else{
            var notice = "Your email "+user.email+" is verified";
            res.render("AdminView/verify",{notice: notice, layout:false});
        }
    });

};

exports.user_verification_get_member = function (req,res,next) {
    console.log(req.protocol+":/"+req.get('host'));
    User.findById(req.params.id).exec(function (err,user) {
        if(err){
            console.log(err);
            res.end("<h1>Error 404</h1>");
        }
        else
        {
            if (user != null && user !=undefined)
            {
                if (user.active == true){
                    res.redirect('/');
                }
            }
            else
            {
                res.end("<h1>User can not be found</h1>");
            }
        }
    });
    var user_instance = new User();
    user_instance._id = req.params.id;
    user_instance.active = true;
    User.findByIdAndUpdate(req.params.id,user_instance,{}).exec(function (err,user) {
        if (err){
            res.end("<h1>Cannot find account</h1>");
        }
        else{
            var notice = "Your email "+user.email+" is verified";
            brandController.get_list_brands(function(err, brands) {
			categoryController.get_list_categories(function(err, categories) {
            res.render("UserView/verify",{brands: brands, categories: categories,notice: notice, layout:false});
			});
			});
        }
    });

};

exports.user_edit_info_post = function (req,res,next) {
    req.checkBody('name','Your name is require').notEmpty();
    var messages = [];
    var email = req.user.email;

    var name = req.body.name;
    var oldpass = req.body.oldpass;
    var newpass = req.body.newpass;
    var newpassretypre= req.body.passwordretype;

    /*if (((oldpass == null && newpass == null && newpassretypre==null)||(oldpass=='' && newpass=='' && newpassretypre == ''))&& (name !=null || name!='')){
        res.redirect('/admin/profile');
    }
    else*/

    var nochangepass= (oldpass =='') || (newpass =='') || (newpassretypre =='');
    var nulldata = (oldpass !=null) || (newpass !=null) || (newpassretypre !=null);
    //console.log(nochangepass);
    //console.log(nulldata);
    var id = req.user["_id"];

   // console.log(id);
    if (!nochangepass)
    {
       User.findOne({'email': email}).exec(function (err, user) {
            if (err) {
                messages.push(err);
            }

            if (!user.validPassword(oldpass)) {
                messages.push('Wrong old password!');
                
            }
        });
        console.log('error');
        req.checkBody('newpass', 'Password is require').notEmpty();
        req.checkBody('newpass', 'Password minimum length is 6').isLength({min:6});
        req.checkBody('passwordretype', 'Password do not match').equals(req.body.newpass);
    }
    var errors = req.validationErrors();
    //var user_update='';
    if (errors){
        var messages = [];
        errors.forEach(function(error){
            messages.push(error.msg);
        });
       // return done(null, false, req.flash('error', messages));
    }
    else{

        var user_instance = new User();
        user_instance._id = id;
        user_instance.name = name;

        if (!nochangepass){
           // var passencrypt = User.encryptPassword(newpass);
            /*user_instance = new User({
                _id: id,
                name: name,
                password: bcrypt.hashSync(newpass, bcrypt.genSaltSync(5), null),
            });*/
            user_instance.password = bcrypt.hashSync(newpass, bcrypt.genSaltSync(5), null);

        }
        /*else
        {
            user_instance = new User({
                _id: id,
                name: name,
            });
        }*/
        //console.log(req.file);
        if (req.file != undefined)
        {
            var avatar = req.user["avatar"];

            user_instance.avatar = Return_path_upload(req.file.path);
            req.user.avatar = user_instance.avatar;
            //console.log("Avatar: "+req.user["avatar"]);
            if (!(avatar == undefined || avatar == null || avatar=='')){
                var del_img = "./public"+avatar;
                fs.unlink(del_img, function(err){
                    if(err){
                        console.log(err);
                    }
                    else{
                        console.log("Success");
                    }
                });
            }
        }
        console.log(user_instance);
        User.findByIdAndUpdate(id,user_instance,{}).exec(function (err,user) {
            if(err){
                //messages.push(err);
                console.log(err);
            }

            if (user != null && user != undefined)
            {
                req.user.name = user.name;
                req.user.avatar = user.avatar;
            }


        });
    }
    console.log(messages);
   // console.log(user_update);
    res.render('AdminView/profile', {
        title: '1412330 - Đinh Lê Trà My',
        csrfToken: req.csrfToken(),
        userProfile: req.user,
        layout: 'AdminView/layout',
        messages: messages,
        hasErrors: messages.length > 0
    });

};

exports.user_edit_info_post_member = function (req,res,next) {
    req.checkBody('name','Your name is require').notEmpty();
    var messages = [];
    var email = req.user.email;

    var name = req.body.name;
    var oldpass = req.body.oldpass;
    var newpass = req.body.newpass;
    var newpassretypre= req.body.passwordretype;


    var nochangepass= (oldpass =='') || (newpass =='') || (newpassretypre =='');
    var nulldata = (oldpass !=null) || (newpass !=null) || (newpassretypre !=null);
   
    var id = req.user["_id"];

   
    if (!nochangepass)
    {
       User.findOne({'email': email}).exec(function (err, user) {
            if (err) {

                messages.push(err);
            }

            if (!user.validPassword(oldpass)) {

                messages.push('Wrong old password!');
            }
        });
        console.log('error');
        req.checkBody('newpass', 'Password is require').notEmpty();
        req.checkBody('newpass', 'Password minimum length is 6').isLength({min:6});
        req.checkBody('passwordretype', 'Password do not match').equals(req.body.newpass);
    }
    var errors = req.validationErrors();
   
    if (errors){
        var messages = [];
        errors.forEach(function(error){
            messages.push(error.msg);
        });
    }
    else{

        var user_instance = new User();
        user_instance._id = id;
        user_instance.name = name;
        req.user.name = name;
        if (!nochangepass){
          
            user_instance.password = bcrypt.hashSync(newpass, bcrypt.genSaltSync(5), null);

        }
        
        if (req.file != undefined)
        {
            var avatar = req.user["avatar"];

            user_instance.avatar = Return_path_upload(req.file.path);
            req.user.avatar = user_instance.avatar;
            if (!(avatar == undefined || avatar == null || avatar=='')){
                var del_img = "./public"+avatar;
                fs.unlink(del_img, function(err){
                    if(err){
                        console.log(err);
                    }
                    else{
                        console.log("Success");
                    }
                });
            }
        }
        console.log(user_instance);
        User.findByIdAndUpdate(id,user_instance,{}).exec(function (err,user) {
            if(err){
                
                console.log(err);
            }

        });
    }
    console.log(messages);
	brandController.get_list_brands(function(err, brands) {
			categoryController.get_list_categories(function(err, categories) {
	var productID = [];
	productID=req.session.productID || [];
	var items = 0;
	if (productID.length > 0)
		items = productID.length;
	
    res.render('UserView/profile', {
        title: 'Shopping Mall',
        csrfToken: req.csrfToken(),
        userProfile: req.user,
		brands: brands, 
		categories: categories,
        layout: 'UserView/layout',
        messages: messages,
		items: items,
        hasErrors: messages.length > 0
    });
	});
	});

};

exports.user_list_get = function (req,res,next) {
    User.find({}).sort({role: 1}).exec(function(err, users) {
        if (err)
        {
            console.log(err);
            return;
        }
        res.render('AdminView/members',{
            users: users,
            title: '1412330 - Đinh Lê Trà My',
            layout: 'AdminView/layout',
            userProfile: req.user,
            csrfToken: req.csrfToken()
        });
    });
};

exports.user_list_post = function (req,res,next) {
    console.log(req.body.id);
    var id_cur_user = req.user["_id"];
    var id_arr =[];
    id_arr = id_arr.concat(req.body.id);
    var id_url='';
    id_arr.forEach(function (id) {
        if (id != id_cur_user){
            id_url = id_url+id + "cAAc";
        }
    });
    res.redirect('/admin/members/delete?re='+id_url);
    //res.send(200);
}

exports.user_edit_info_mem_get = function (req,res,next) {
    console.log(req.params.id);
    User.findById(req.params.id).exec(function (err,user) {
        if(err){
            console.log(err);
            return;

        }
        var isAdmin = (user["role"] == "admin");
        var isMem = (user["role"] == "member");
        var adm;
        var mem;
        var active;
        if (isAdmin)
        {
            adm = "checked";

        }
        else{
            mem ="checked";
        }

        if (user.active == true){
            active="checked";
        }
        res.render('AdminView/memberinfo', {
            title: '1412330 - Đinh Lê Trà My',
            layout: 'AdminView/layout',
            csrfToken: req.csrfToken(),
            userProfile: req.user,
            user: user,
            active: active,
            admin: adm, member:mem});
    });
   // res.render('AdminView/memberinfo', {title: '1412330 - Đinh Lê Trà My',layout: 'AdminView/layout',userProfile: req.user})
};

exports.user_edit_info_mem_post = function (req,res,next) {
    console.log(req.body);
    req.checkBody('name','Your name is require').notEmpty();
    var messages = [];
    var errors = req.validationErrors();
    //var user_update='';
    if (errors){
        var messages = [];
        errors.forEach(function(error){
            messages.push(error.msg);
        });
        // return done(null, false, req.flash('error', messages));

        User.findById(req.params.id).exec(function (err,user) {
            if(err){
                console.log(err);
                return;

            }
            var isAdmin = (user["role"] == "admin");
            var isMem = (user["role"] == "member");
            var adm;
            var mem;
            if (isAdmin)
            {
                adm = "checked";

            }
            else{
                mem ="checked";
            }
            res.render('AdminView/memberinfo', {
                title: '1412330 - Đinh Lê Trà My',
                layout: 'AdminView/layout',
                csrfToken: req.csrfToken(),
                userProfile: req.user,
                user: user,
                admin: adm, member:mem,
                messages: messages, hasErrors: messages.length > 0
            });
        });
    }
    else{



        var user_instance = new User();

        user_instance._id = req.params.id;
        user_instance.name = req.body.name;
        user_instance.role = req.body.role;
        var active = req.body.active;
        if (active != undefined && active!='' && active!=null)
        {
            user_instance.active = true;
        }
        User.findByIdAndUpdate(req.params.id,user_instance,{}).exec(function (err,user) {
            if(err){
                messages.push(err);
                console.log(err);
            }


        });
        res.redirect('/admin/members');
    }
};

exports.user_forget_password_get = function (req,res,next) {
    res.render("AdminView/forgetpass",{
        csrfToken: req.csrfToken(),
        layout: 'AdminView/layout'
    });
};

exports.user_forget_password_get_member = function (req,res,next) {
	 brandController.get_list_brands(function(err, brands) {
			categoryController.get_list_categories(function(err, categories) {
				var productID = [];
				productID=req.session.productID || [];
				var items = 0;
				if (productID.length > 0)
					items = productID.length;
    res.render("UserView/forgetpass",
	{brands: brands, categories: categories,
        csrfToken: req.csrfToken(),
		items: items,
        layout: 'UserView/layout'
    });
	});
	});
};

exports.user_forget_password_post = function (req,res,next) {


    var email = req.body.email;
    User.findOne({'email': email}).exec(function(err, user)
    {
        if(err){
           console.log(err);
        }
        if (user != null && user != undefined)
        {

            var success = "Request has send to " + email;
            SendResetPasswordMail(req,user);                        //Send email reset password
            res.render("AdminView/forgetpass",{
                success: success,
                csrfToken: req.csrfToken(),
                layout: 'AdminView/layout'});

        }
        else
        {

            res.render("AdminView/forgetpass",{
                message: 'Email does not exists',
                csrfToken: req.csrfToken(),
                hasErrors: true,
                layout: 'AdminView/layout'
            });

        }
    });

};

exports.user_forget_password_post_member = function (req,res,next) {


    var email = req.body.email;
    User.findOne({'email': email}).exec(function(err, user)
    {
        if(err){
           console.log(err);
        }
        if (user != null && user != undefined)
        {
			var productID = [];
			productID=req.session.productID || [];
			var items = 0;
			if (productID.length > 0)
				items = productID.length;
            var success = "Request has send to " + email;
            SendResetPasswordMailMember(req,user);                       //Send email reset password
            brandController.get_list_brands(function(err, brands) {
			categoryController.get_list_categories(function(err, categories) {
			res.render("UserView/forgetpass",{brands: brands,categories: categories,
                success: success,
                csrfToken: req.csrfToken(),
				items: items,
                layout: 'UserView/layout'});
				});
				});

        }
        else
        {
			var productID = [];
			productID=req.session.productID || [];
			var items = 0;
			if (productID.length > 0)
				items = productID.length;
			brandController.get_list_brands(function(err, brands) {
			categoryController.get_list_categories(function(err, categories) {
            res.render("UserView/forgetpass",{
                message: 'Email does not exists',
				brands: brands,
				categories: categories,
                csrfToken: req.csrfToken(),
                hasErrors: true,
				items: items,
                layout: 'UserView/layout'
            });
			});
			});

        }
    });

};

exports.user_reset_password_get = function (req,res,next) {
    res.render("AdminView/resetpassword",{
        csrfToken: req.csrfToken(),
        layout: 'AdminView/layout'}
        );
};

exports.user_reset_password_get_member = function (req,res,next) {
	brandController.get_list_brands(function(err, brands) {
			categoryController.get_list_categories(function(err, categories) {
				var productID = [];
				productID=req.session.productID || [];
				var items = 0;
				if (productID.length > 0)
					items = productID.length;
    res.render("UserView/resetpassword",{
        brands: brands,
		categories: categories,
		csrfToken: req.csrfToken(),
		items: items,
        layout: 'UserView/layout'}
        );
		});
			});
};

exports.user_reset_password_post = function (req,res,next) {

    var reset_qr = req.query.reset;
    var id = req.params.id;
    console.log("id: "+id);
    console.log("Reset: "+reset_qr);

    var messages = [];
    if (reset_qr != null && reset_qr!=undefined && reset_qr != '' )             //check reset toke param
    {
        User.findById(id).exec(function (err, user) {                           //find user
            if (err) {
                console.log(err);
                res.end("<h1>Error can not find!</h1>");
            }
            else {
                if (user != null && user != undefined) {
                    console.log("Reset token: " + user.reset_token);
                    if (user.reset_token == reset_qr) {
                        var message = [];
                        req.checkBody('password', 'Password minimum length is 6').isLength({min: 6});
                        req.checkBody('password', 'Password is required').notEmpty();
                        req.checkBody('passwordretype', 'Retyping password is require').notEmpty();
                        req.checkBody('passwordretype', 'Password do not match').equals(req.body.password);
                        var errors = req.validationErrors();
                        if (errors) {

                            errors.forEach(function (error) {
                                messages.push(error.msg);
                            });
                        }
                        if (messages.length > 0) {
                            res.render("AdminView/resetpassword", {
                                messages: messages, hasErrors: messages.length > 0,
                                csrfToken: req.csrfToken(),
                                layout: 'AdminView/layout'
                            });

                        }
                        else {
                            var user_instance = new User();
                            user_instance._id = id;
                            user_instance.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(5), null);
                            user_instance.reset_token='';
                            User.findByIdAndUpdate(id, user_instance, {}).exec(function (err, user) {
                                console.log(user);
                                if (user != null && user != undefined) {

                                    res.render("AdminView/resetpassword", {
                                        //messages: messages, hasErrors: messages.length > 0,
                                        success: 'Reset password success',
                                        csrfToken: req.csrfToken(),
                                        layout: 'AdminView/layout'
                                    });
                                }
                                else {
                                    if (err) {
                                        messages.push('Update information error');
                                    }
                                    res.render("AdminView/resetpassword", {
                                        messages: messages, hasErrors: messages.length > 0,
                                        csrfToken: req.csrfToken(),
                                        layout: 'AdminView/layout'
                                    });
                                }
                            });
                        }

                    }
                    else {
                        res.end("<h1>Link is expired</h1>");
                    }
                }
            }

        });
    }
    else
    {
        res.send("<h1>Reset token does not exists</h1>");
    }

};

exports.user_reset_password_post_member = function (req,res,next) {

    var reset_qr = req.query.reset;
    var id = req.params.id;
    console.log("id: "+id);
    console.log("Reset: "+reset_qr);

    var messages = [];
    if (reset_qr != null && reset_qr!=undefined && reset_qr != '' )             //check reset toke param
    {
        User.findById(id).exec(function (err, user) {                           //find user
            if (err) {
                console.log(err);
                res.end("<h1>Error can not find!</h1>");
            }
            else {
                if (user != null && user != undefined) {
                    console.log("Reset token: " + user.reset_token);
                    if (user.reset_token == reset_qr) {
                        var message = [];
                        req.checkBody('password', 'Password minimum length is 6').isLength({min: 6});
                        req.checkBody('password', 'Password is required').notEmpty();
                        req.checkBody('passwordretype', 'Retyping password is require').notEmpty();
                        req.checkBody('passwordretype', 'Password do not match').equals(req.body.password);
                        var errors = req.validationErrors();
                        if (errors) {

                            errors.forEach(function (error) {
                                messages.push(error.msg);
                            });
                        }
                        if (messages.length > 0) {
							brandController.get_list_brands(function(err, brands) {
							categoryController.get_list_categories(function(err, categories) {
                            res.render("UserView/resetpassword", {
                                brands: brands,
								categories: categories,
								messages: messages, hasErrors: messages.length > 0,
                                csrfToken: req.csrfToken(),
                                layout: 'UserView/layout'
                            });
							});
							});

                        }
                        else {
                            var user_instance = new User();
                            user_instance._id = id;
                            user_instance.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(5), null);
                            user_instance.reset_token='';
                            User.findByIdAndUpdate(id, user_instance, {}).exec(function (err, user) {
                                console.log(user);
                                if (user != null && user != undefined) {
									brandController.get_list_brands(function(err, brands) {
							categoryController.get_list_categories(function(err, categories) {
								var productID = [];
									productID=req.session.productID || [];
									var items = 0;
									if (productID.length > 0)
										items = productID.length;
                                    res.render("UserView/signin", {
										//messages: messages, hasErrors: messages.length > 0,
										brands: brands,
										categories: categories,
                                        success: 'Reset password success',
                                        csrfToken: req.csrfToken(),
										items: items,
                                        layout: 'UserView/layout'
                                    });
									});
									});
                                }
                                else {
                                    if (err) {
                                        messages.push('Update information error');
                                    }
									brandController.get_list_brands(function(err, brands) {
							categoryController.get_list_categories(function(err, categories) {
										var productID = [];
										productID=req.session.productID || [];
										var items = 0;
										if (productID.length > 0)
											items = productID.length;
                                    res.render("UserView/resetpassword", {
										brands: brands,
										categories: categories,
                                        messages: messages, hasErrors: messages.length > 0,
                                        csrfToken: req.csrfToken(),
										items: items,
                                        layout: 'UserView/layout'
                                    });
									});
									});
                                }
                            });
                        }

                    }
                    else {
                        res.end("<h1>Link is expired</h1>");
                    }
                }
            }

        });
    }
    else
    {
        res.send("<h1>Reset token does not exists</h1>");
    }

};

exports.user_delete_mem_get = function (req,res,next) {
    console.log(req.query);
    if (req.query.re.length >= 28) {
        var id_arr = req.query.re.split("cAAc");
        id_arr.splice(id_arr.length - 1, 1);
        console.log("Size array: " + id_arr.length);
        User.find({_id: id_arr}).sort({_id: 1}).exec(function (err, users) {
            console.log(users);
            if (err) {
                console.log(err);
            }
            if (users.length == id_arr.length) {
                res.render("AdminView/membersdelete", {
                    title: '1412330 - Đinh Lê Trà My',
                    users: users,
                    userProfile: req.user,
                    csrfToken: req.csrfToken(),
                    layout: 'AdminView/layout'
                });
            }
            else {
                res.render("AdminView/membersdelete", {
                    title: '1412330 - Đinh Lê Trà My',
                    userProfile: req.user,
                    csrfToken: req.csrfToken(),
                    layout: 'AdminView/layout'
                });
            }


        });
    }
    else
    {
        res.end("<h1>Link is not define</h1>");
    }

    //console.log(a);




};

exports.user_delete_mem_post = function (req,res,next) {
    var id_arr = req.query.re.split("cAAc");
    id_arr.splice(id_arr.length -1,1);
    console.log("Size array: "+id_arr.length);

    User.remove({_id: id_arr}).exec(function (err) {
        if (err){
            console.log(err);
        }
        else{
            res.redirect('/admin/members');
        }
    });
    /*res.render("AdminView/membersdelete",{
        title: '1412330 - Đinh Lê Trà My',
        csrfToken: req.csrfToken(),
        userProfile: req.user,
        layout: 'AdminView/layout'
    });*/
};
function Return_path_upload(sourcepathfile)
{
    var imgpath = sourcepathfile.replace("public\\", "/");
    imgpath = imgpath.replace("\\", "/");
    imgpath = imgpath.replace("\\", "/");
    return imgpath;
}

function SendResetPasswordMail(req,user) {
    var token = bcrypt.hashSync(user["_id"], bcrypt.genSaltSync(5), null);
    User.findByIdAndUpdate(user["_id"],{_id: user["_id"],reset_token: token}).exec(function (err,user) {
        if(err)
        {
            console.log(err);
        }
        console.log("USER: " + user);
    });
    
    
    var host=req.get('host');
    var link="http://"+req.get('host')+"/admin/resetpassword/"+user["_id"]+"?reset="+token;              //link to reset password
    var mailOptions={
        to : user["email"],
        subject : "Reset your password",
        html : "Hello,<br> Please Click on the link to reset your password.<br><a href="+link+">Click here to reset your password</a>"
    }
    console.log(mailOptions);
    transport.sendMail(mailOptions, function(error, response){
        if(error){
            console.log(error);

        }
        else{
            console.log("Message sent: " + response.message);

        }
    });
}

function SendResetPasswordMailMember(req,user) {
    var token = bcrypt.hashSync(user["_id"], bcrypt.genSaltSync(5), null);
    User.findByIdAndUpdate(user["_id"],{_id: user["_id"],reset_token: token}).exec(function (err,user) {
        if(err)
        {
            console.log(err);
        }
        console.log("USER: " + user);
    });
    
    
    var host=req.get('host');
    var link="http://"+req.get('host')+"/user/resetpassword/"+user["_id"]+"?reset="+token;              //link to reset password
    var mailOptions={
        to : user["email"],
        subject : "Reset your password",
        html : "Hello,<br> Please Click on the link to reset your password.<br><a href="+link+">Click here to reset your password</a>"
    }
    console.log(mailOptions);
    transport.sendMail(mailOptions, function(error, response){
        if(error){
            console.log(error);

        }
        else{
            console.log("Message sent: " + response.message);

        }
    });
}

var getListUser = function (callback) {
	User.find(function(err,users){
		 if (err) {
            //console.log('Product not found');
            //callback(err? err: 'Product not found');
        } else {
            //callback(null, products);
			callback(null, users);
        }
		//return doc2;
	});

};

module.exports.get_list_users = getListUser;