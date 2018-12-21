var express = require('express');
var router = express.Router();
var async = require('async');
var Product = require ('../../models/product');
var Brand = require('../../models/brand');
var Category = require('../../models/category');
var orderController = require('../../controllers/orderController');
/* GET home page. */

router.get('/',LoginAsAdmin, function(req, res, next) {

	var userProfile = req.user;
	async.parallel({
		product_list: function (callback) {
			Product.find({}).sort({category:1,brand:1}).exec(callback);
        },
		brand_list: function (callback) {
			Brand.find({}).exec(callback);
        },
		category_list: function (callback) {
			Category.find({}).exec(callback);
        },
	}, function (err,results) {
        var productChunks = [];
        var arr_product = results.product_list;
        var arr_brand = results.brand_list;
        var arr_category = results.category_list;


        for (var i = 0; i < arr_product.length;i++)
		{
			var category = 'unknown';
			var brand = 'unknown';
			for (var ii = 0; ii< arr_brand.length; ii++)
			{
				if (arr_brand[ii]._id == arr_product[i].brand)
				{
					brand = arr_brand[ii].name;
					break;
				}
			}
			for (var ii = 0; ii<arr_category.length; ii++)
			{
                if (arr_category[ii]._id == arr_product[i].category)
                {
                    category = arr_category[ii].name;
                    break;
                }
			}
			var m_product = {
				_id: arr_product[i]._id,
                imagePath: arr_product[i].imagePath,
				title: arr_product[i].title,
				price: arr_product[i].price,
				category: category,
				brand: brand
			}
			productChunks.push(m_product);
		}
		console.log(productChunks);
        res.render('AdminView/index', {
            title: 'Shopping Mall - Admin',
            products: productChunks,
            userProfile: userProfile,
            layout: 'AdminView/layout'
        });
    });
});

router.get('/statistic_time',LoginAsAdmin,orderController.statistic_order_time_get);
router.post('/statistic_time',LoginAsAdmin,orderController.statistic_order_time_post);
router.get('/statistic_product',LoginAsAdmin,orderController.statistic_order_product_get);
router.post('/statistic_product',LoginAsAdmin,orderController.statistic_order_product_post);
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