var express = require('express');
var router = express.Router();
var Product = require ('../../models/product');
var Category = require('../../models/category');
var Brand = require('../../models/brand');
var categoryController = require('../../controllers/categoryController');
var branchController =require('../../controllers/brandController');
/*Upload file*/
var multer  = require('multer');
const crypto = require('crypto');
var path = require('path')
var fs = require('fs');
var async = require('async');

var storage = multer.diskStorage({
    destination: function (req,file,cb) {
        cb(null,'public/upload/products');
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


/* GET home page. */
router.get('/product',LoginAsAdmin, function(req, res, next) {
    var userProfile = req.user;
    async.parallel({
        categories: function(callback){
            Category.find({}).sort({name: 1}).exec(callback);
        },
        brands: function (callback) {
            Brand.find({}).sort({name: 1}).exec(callback);
        },
    }, function (err, results) {
        if (err)
        {
            return next(err);
        }
        console.log(results);
        res.render('AdminView/add', {
            title: 'Admin Shopping Mall',
            userProfile: userProfile,
            categories: results.categories,
            brands: results.brands,
            layout: 'AdminView/layout'
        });
    });

  
});
router.post('/product',upload.fields([{ name: 'productimg1', maxCount: 1 }, { name: 'productimg2', maxCount: 1 },{name: 'productimg3', maxCount:1}]),LoginAsAdmin, function (req, res,next) {
	var userProfile = req.user;
	/*console.log(req.file);*/
	var messages = [];
	console.log(req.body.qty);
	req.checkBody('title','Title is required').notEmpty();
	req.checkBody('price','Price is required').notEmpty();
	req.checkBody('price','Price must be a number').isNumeric();
    req.checkBody('size','Size is required').notEmpty();
    req.checkBody('qty','Quantity is required').notEmpty();
    req.checkBody('category','You must choose a category').notEmpty();
    req.checkBody('brand','You must choose a brand').notEmpty();
    var size = [];
    size =size.concat(req.body.size);
    var qty = [];
    qty = qty.concat(req.body.qty);
    if (size.length == qty.length){
        console.log("Bang nhau");
        console.log(qty.length);
        var i;
        for ( i =0;i<qty.length;i++){

            if (isInteger(qty[i])){
                console.log(toInt(qty[i])+" is number");
                qty[i] = toInt(qty[i]);
            }
            else
            {
                messages.push('Quantity must be a number');
                break;
            }
        }

    }

    var img_arr = req.files;
	if (img_arr.productimg1 == undefined || img_arr.productimg2 == undefined || img_arr.productimg3 == undefined ){
		messages.push('Please choose 3 product images');
	}


    var errors = req.validationErrors();
    if (errors) {
        var messages = [];
        errors.forEach(function (error) {
            messages.push(error.msg);
        });
    }
    console.log(messages);
    //If have error
    if (messages.length > 0){

        if (img_arr.productimg1 != undefined && img_arr.productimg1 != null){
            Delete_file_upload(img_arr.productimg1[0]);
        }
        if (img_arr.productimg2 != undefined && img_arr.productimg2 != null){
            Delete_file_upload(img_arr.productimg2[0]);
        }
        if (img_arr.productimg3 != undefined &&img_arr.productimg3 != null){
            Delete_file_upload(img_arr.productimg3[0]);
        }
            /*var imgpath = Return_path_upload(req.file.path);
            var del_img = "./public"+imgpath;
            fs.unlink(del_img, function(err){
                if(err){
                    console.log(err);
                }
                else{
                    console.log("Success");
                }
            });*/

        res.render('AdminView/add', {
        	title: 'Admin Shopping Mall',
			userProfile: userProfile,
			layout: 'AdminView/layout',
            messages: messages,
            hasErrors: messages.length > 0
        });
	}
	//if no have errors
	else {
       /* var sourcepathfile = req.file.path;
        var imgpath = sourcepathfile.replace("public\\", "/");
        imgpath = imgpath.replace("\\", "/");
        imgpath = imgpath.replace("\\", "/");
        console.log(sourcepathfile);
        console.log(imgpath);

        console.log('User created!');*/
       var imgpath = [];                        // Array save path product images
       imgpath.push(Return_path_upload(img_arr.productimg1[0].path));
        imgpath.push(Return_path_upload(img_arr.productimg2[0].path));
        imgpath.push(Return_path_upload(img_arr.productimg3[0].path));
       //var imgpath = Return_path_upload(req.file.path);
        var product = Product({
            imagePath: imgpath,
            title: req.body.title,
            description: req.body.description,
            price: req.body.price,
            size: req.body.size,
            category: req.body.category,
            brand: req.body.brand,
            quantity: req.body.qty,
            view: 0
        });
        product.save(function (err) {
            if (err) throw err;

           // console.log('User created!');
        });
        async.parallel({
           categories: function(callback){
                Category.find({}).sort({name: 1}).exec(callback);
           },
            brands: function (callback) {
                Brand.find({}).sort({name: 1}).exec(callback);
            },
        }, function (err, results) {
            if (err)
            {
                return next(err);
            }
            res.render('AdminView/add', {
                title: 'Admin Shopping Mall',
                userProfile: userProfile,
                categories: results.categories,
                brand: results.brands,
                success: 'Add new product successfully',
                layout: 'AdminView/layout'
            });
        });
       /*res.render('AdminView/add', {
            title: 'Admin Shopping Mall',
            userProfile: userProfile,
            layout: 'AdminView/layout'
        });*/
    }
});

router.get('/category',LoginAsAdmin,categoryController.add_new_category_get);
router.post('/category',LoginAsAdmin,categoryController.add_new_category_post);
router.get('/brand',LoginAsAdmin,branchController.add_new_brand_get);
router.post('/brand',LoginAsAdmin,branchController.add_new_brand_post);
module.exports = router;

function isLoggedIn(req, res, next){
	if (req.isAuthenticated()){
		return next();
	}
	res.redirect('/');
}

function LoginAsAdmin(req, res, next){
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

function Return_path_upload(sourcepathfile)
{
    var imgpath = sourcepathfile.replace("public\\", "/");
    imgpath = imgpath.replace("\\", "/");
    imgpath = imgpath.replace("\\", "/");
    return imgpath;
}

function Delete_file_upload(file){
    var imgpath = Return_path_upload(file.path);
    var del_img = "./public"+imgpath;
    fs.unlink(del_img, function(err){
        if(err){
            console.log(err);
        }
        else{
            console.log("Success");
        }
    });
}

function isInteger(data){
    data = data +"e1";                      // Disallow eng. notation "10e2"+"e1" is NaN
    var clean = parseInt(data,10) / data ; // 1 if parsed cleanly
    return (clean && (data%1) === 0);          // Checks For integer and NaN
}
function toInt(data) {
    data = data +"e1";                      // Disallow eng. notation "10e2"+"e1" is NaN
    var clean = parseInt(data,10)
    return clean;
}