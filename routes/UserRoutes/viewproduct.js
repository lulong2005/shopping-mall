var express = require('express');
var router = express.Router();

var productController = require('../../controllers/productController');
/* GET home page. */
router.get('/category/:id', productController.get_list_product_category);
router.get('/brand/:id', productController.get_list_product_brand);
router.post('/category/:id', productController.get_list_product_category_post);
router.post('/brand/:id', productController.get_list_product_brand_post);
router.get('/detail/:id', productController.get_product_detail);
router.post('/detail/:id', productController.add_to_cart);
//router.get('/filter', productController.filter_get);
router.post('/filter', productController.filter);

module.exports = router;