var express = require('express');
var router = express.Router();

var productController = require('../../controllers/productController');
/* GET home page. */
router.get('/', productController.get_list_product_home);
router.post('/', productController.get_list_product_home_post);

module.exports = router;