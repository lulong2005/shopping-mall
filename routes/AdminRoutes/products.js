var express = require('express');
var router = express.Router();
var Product = require ('../../models/product');
var Category = require('../../models/category');
var Brand = require('../../models/brand');
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
router.get('/', function(req, res, next) {
	console.log(req.params.id);
		var userProfile = req.user;
		res.render('AdminView/detail', {
			title: 'Admin Shopping Mall',
			userProfile: userProfile,
			layout: 'AdminView/layout'
		});

  
});

router.get('/detail/:id',LoginAsAdmin, function (req, res, next){
	var userProfile = req.user;
	console.log(req.params.id);
	Product.findById(req.params.id).exec(function(err,docs){
		console.log(docs);
		res.render('AdminView/detail', {
			title: 'Admin Shopping Mall',
			item: docs,
			userProfile: userProfile,
			layout: 'AdminView/layout'
		});
	});
});

router.post('/detail/:id',LoginAsAdmin, function (req, res){

	var choose = req.body.choose;
	console.log(choose);
		switch (choose)
	{
		case "Delete":
		{
			Product.findByIdAndRemove(req.params.id).exec(function(err) {
			if (err) throw err;

			console.log('deleted!');
			res.redirect('/admin');
			});
		}
		break;
		case "Edit":
		{
			res.redirect('/products/edit/'+req.params.id);

		}
		break;
		
		
	}
});
router.get('/edit/:id',LoginAsAdmin, function (req, res, next){
	var userProfile = req.user;
	var sizeqty = [];

	//console.log(req.params.id);
	Product.findOne({'_id': req.params.id}).exec(function(err,product){
		//console.log(docs);
        if (product) {
            var i;
            var sizeqty = [];
            for(i=0;i<product.size.length;i++)
            {
                var m_sizeqty = {
                    size: product.size[i],
                    qty: product.quantity[i]
                };
                sizeqty.push(m_sizeqty);
            }
            console.log(sizeqty);
            async.parallel({
                categories: function(callback){
                    Category.find({}).sort({name: 1}).exec(callback);
                },
                brands: function (callback) {
                    Brand.find({}).sort({name: 1}).exec(callback);
                },
                findcategory: function (callback) {
                    Category.findOne({'_id': product.category}).exec(callback);
                },
                findbrand: function (callback) {
                    Brand.findOne({'_id:': product.brand}).exec(callback);
                },
            }, function (err, results) {
                res.render('AdminView/edit', {
                    title: 'Admin Shopping Mall',
                    item: product,
                    categories: results.categories,
                    brands: results.brands,
                    sizeqty: sizeqty,
                    userProfile: userProfile,
                    layout: 'AdminView/layout'
                });
            });
           /* res.render('AdminView/edit', {
                title: 'Admin Shopping Mall',
                item: product,
                userProfile: userProfile,
                layout: 'AdminView/layout'
            });*/
        }
        else
        {
            res.send(404);
        }
	});
});

router.post('/edit/:id',upload.fields([{ name: 'productimg1', maxCount: 1 }, { name: 'productimg2', maxCount: 1 },{name: 'productimg3', maxCount:1}]),LoginAsAdmin, function (req, res){
    var userProfile = req.user;
	//var file = req.file;
	var messages = [];

    var img_arr = req.files;
    req.checkBody('title', 'Title is required').notEmpty();
    req.checkBody('price', 'Price is required').notEmpty();
	req.checkBody('price', 'Price must be a number').isNumeric();
	req.checkBody('size', 'Size is required').notEmpty();
    req.checkBody('qty', 'Quantity is required').notEmpty();

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


    console.log(req.body.pathimg);
	//console.log(file);

    var errors = req.validationErrors();
    //var user_update='';
    if (errors) {
        var messages = [];
        errors.forEach(function (error) {
            messages.push(error.msg);
        });

        if (img_arr.productimg1 != undefined && img_arr.productimg1 != null){
            Delete_file_upload(img_arr.productimg1[0]);
        }
        if (img_arr.productimg2 != undefined && img_arr.productimg2 != null){
            Delete_file_upload(img_arr.productimg2[0]);
        }
        if (img_arr.productimg3 != undefined &&img_arr.productimg3 != null){
            Delete_file_upload(img_arr.productimg3[0]);
        }

        /*if (req.file != undefined){
            var imgpath = Return_path_upload(req.file.path);
            var del_img = "./public"+imgpath;
            fs.unlink(del_img, function(err){
                if(err){
                    console.log(err);
                }
                else{
                    console.log("Success");
                }
            });
        }*/
        Product.findById(req.params.id).exec(function(err,docs){
            res.render('AdminView/edit', {
                title: 'Admin Shopping Mall',
                item: docs,
                userProfile: userProfile,
                layout: 'AdminView/layout',
                messages: messages,
                hasErrors: messages.length > 0
            });

        });
    }
    else {
    	var imgpath=[];
    	var product_instance = new Product();
    	product_instance._id = req.params.id;
    	product_instance.title = req.body.title;
    	product_instance.price = req.body.price;
    	product_instance.description = req.body.description;

        if (img_arr.productimg1 != undefined && img_arr.productimg1 != null){
            Delete_file_upload_link(req.body.pathimg1);												//Delete old picture
			imgpath.push(Return_path_upload(img_arr.productimg1[0].path));
        }
        else
		{
			imgpath.push(req.body.pathimg1);
		}
        if (img_arr.productimg2 != undefined && img_arr.productimg2 != null){
            Delete_file_upload_link(req.body.pathimg2)												//Delete old picture
            imgpath.push(Return_path_upload(img_arr.productimg2[0].path));
        }
        else
		{
			imgpath.push(req.body.pathimg2);
		}
        if (img_arr.productimg3 != undefined &&img_arr.productimg3 != null){
            Delete_file_upload_link(req.body.pathimg3);												//Delete old picture
            imgpath.push(Return_path_upload(img_arr.productimg3[0].path));
        }
        else
		{
			imgpath.push(req.body.pathimg3);
		}
        product_instance.imagePath = imgpath;
        product_instance.brand = req.body.brand;
        product_instance.category = req.body.category;
        product_instance.size = req.body.size;
        product_instance.quantity = req.body.qty;

		Product.findByIdAndUpdate(req.params.id,product_instance,{}).exec(function (err,user){
			if (err){
				messages.push(err);
				console.log(err);
			}
			else{
                res.redirect('/products/detail/'+req.params.id);
			}
		});

    }
	console.log(messages);

});

module.exports = router;

function isLoggedIn(req, res, next){
    if (req.isAuthenticated()){
        console.log(req.user.role);
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
function Delete_file_upload_link(imgpath){
    //var imgpath = Return_path_upload(file.path);
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