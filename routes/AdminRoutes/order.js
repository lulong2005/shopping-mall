/**
 * Created by musia on 28/06/2017.
 */
var express = require('express');
var router = express.Router();
var orderController = require('../../controllers/orderController');

router.get('/',LoginAsAdmin,orderController.order_list_get_admin);
router.post('/',LoginAsAdmin,orderController.order_list_post_admin);
router.get('/detail/:id',LoginAsAdmin,orderController.get_detail_order_list_get);
router.post('/detail/:id',LoginAsAdmin,orderController.get_detail_order_list_post);

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
