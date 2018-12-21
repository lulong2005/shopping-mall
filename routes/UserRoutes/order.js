var express = require('express');
var router = express.Router();

var orderController = require('../../controllers/orderController');
/* GET home page. */
router.get('/orderlist', orderController.get_order_list);
router.post('/orderlist', orderController.post_order_list);
router.get('/info',isLoggedIn,orderController.save_order_list_get);
router.post('/info',isLoggedIn,orderController.save_order_list_post);
router.get('/orderhistory',isLoggedIn,orderController.get_order_history);
router.get('/remove/:index',orderController.get_order_remove);
module.exports = router;
function isLoggedIn(req, res, next){
	if (req.isAuthenticated()){
        console.log(req.user.role);
		return next();
	}

	res.redirect('/');
}