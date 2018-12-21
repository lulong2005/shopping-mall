var Order = require ('../models/order');
var User = require('../models/user');
var Category = require('../models/category');
var async = require('async');
var brandController = require('./brandController');
var categoryController = require('./categoryController');
var productController = require('./productController');
var Product = require ('../models/product');

exports.get_order_list = function (req,res,next) {
	var userProfile = req.user;
	var productID = [];//lấy cả product
	var size = [];
	var quantity = [];
	productID=req.session.productID || [];	
	size=req.session.size || [];	
	quantity=req.session.quantity || [];
	var items = 0;
	if (productID.length > 0)
		items = productID.length;
			brandController.get_list_brands(function(err, brands) {
			console.log('Brands: ' + brands);
			categoryController.get_list_categories(function(err, categories) {
			console.log('Categories: ' + categories);
			var unitprice=[];
			var totalprice=0;
			//console.log('Product length: ' + products.length);
			for (var i=0;i<productID.length;i++){
				console.log('In for: ');
				var price = productID[i].price*quantity[i];
				unitprice.push(price);
				totalprice+=price;
				console.log('price: ' + price);
				console.log('price: ' + totalprice);
			}
			var orderlist =[];
			for (var i=0;i<productID.length;i++){
				var orderdetail =[];
				orderdetail.push(productID[i]);
				orderdetail.push(size[i]);
				orderdetail.push(quantity[i]);
				orderdetail.push(unitprice[i]);
				orderlist.push(orderdetail);
			}
			res.render('UserView/orderlist', {
				title: 'Shopping Mall',
				userProfile: userProfile,
				brands: brands,
				categories: categories,
				totalprice: totalprice,
				orderlist: orderlist,
				items: items,
				layout: 'UserView/layout'
				});
			});
		
		});

};

exports.post_order_list = function (req,res,next) {
	var userProfile = req.user;
	var productID = [];
	var size = [];
	var quantity = [];
	productID=req.session.productID || [];	
	size=req.session.size || [];	
	quantity=req.session.quantity || [];
	var items = 0;
	if (productID.length > 0)
		items = productID.length;
			
		brandController.get_list_brands(function(err, brands) {
			console.log('Brands: ' + brands);
			categoryController.get_list_categories(function(err, categories) {
			console.log('Categories: ' + categories);
			var unitprice=[];
			var totalprice=0;
			var messages = [];
			//console.log('Product length: ' + products.length);
			for (var i=0;i<productID.length;i++){
				var pos_size = 0;
				var qty = req.body.qty;
				console.log('qty: ' +qty.length);
				for (var j=0;j<productID[i].size.length;j++){
					if (productID[i].size[j]==size[i]){
						pos_size=j;//position of selected size
					}
				}
				var qtyofsize = productID[i].quantity[pos_size];
				if (qty[i] > 0 && qty[i] <= qtyofsize){
					quantity[i]=qty[i];
					req.session.quantity = quantity;
				console.log('select qty true');	
				
			}
		else if (qty[i] > qtyofsize){
			console.log('Product quantity in stock is not enough. Please retype product quantity!');
			messages.push('Product quantity in stock is not enough. Please retype product quantity!');
		}
		else if (qty[i] <= 0){
			console.log('Invalid quantity');
			messages.push('Invalid quantity.  Please retype product quantity!');
		}
			}
			//console.log('Products: ' + products);
			console.log('ProductsID: ' + productID);
			for (var i=0;i<productID.length;i++){
				console.log('In for: ');
				var price = productID[i].price*quantity[i];
				unitprice.push(price);
				totalprice+=price;
				console.log('price: ' + price);
				console.log('price: ' + totalprice);
			}
			var orderlist =[];
			for (var i=0;i<productID.length;i++){
				var orderdetail =[];
				orderdetail.push(productID[i]);
				orderdetail.push(size[i]);
				orderdetail.push(quantity[i]);
				orderdetail.push(unitprice[i]);
				orderlist.push(orderdetail);
			}
			if (messages.length > 0){
			res.render('UserView/orderlist', {
				title: 'Shopping Mall',
				userProfile: userProfile,
				brands: brands,
				categories: categories,
				totalprice: totalprice,
				orderlist: orderlist,
				items: items,
				messages: messages, hasErrors: messages.length > 0,
				layout: 'UserView/layout'
				});
			}
			else{
				if(req.isAuthenticated()){
					res.render('UserView/orderinfo', {
					title: 'Shopping Mall',
					userProfile: userProfile,
					brands: brands,
					categories: categories,
					items: items,
					layout: 'UserView/layout'
					});
				}
				else{
					res.redirect('/user/signin');
				}
				}

			});
		
		});

};
/*
exports.post_order_list = function (req,res,next) {
	var userProfile = req.user;
	var productID = [];
	var size = [];
	var quantity = [];
	productID=req.session.productID || [];	
	size=req.session.size || [];	
	quantity=req.session.quantity || [];
	var items = 0;
	if (productID.length > 0)
		items = productID.length;
		
			var unitprice=[];
			var totalprice=0;
			var messages = [];
			//console.log('Product length: ' + products.length);
			for (var i=0;i<productID.length;i++){
				var pos_size = 0;
				var qty = req.body.qty;
				console.log('qty: ' +qty.length);
				for (var j=0;j<productID[i].size.length;j++){
					if (productID[i].size[j]==size[i]){
						pos_size=j;//position of selected size
					}
				}
				var qtyofsize = productID[i].quantity[pos_size];
				if (qty[i] > 0 && qty[i] <= qtyofsize){
					quantity[i]=qty[i];
					req.session.quantity = quantity;
				console.log('select qty true');	
				
			}
		else if (qty[i] > qtyofsize){
			console.log('Product quantity in stock is not enough. Please retype product quantity!');
			messages.push('Product quantity in stock is not enough. Please retype product quantity!');
		}
		else if (qty[i] <= 0){
			console.log('Invalid quantity');
			messages.push('Invalid quantity.  Please retype product quantity!');
		}
			}
			console.log('ProductsID: ' + productID);
			for (var i=0;i<productID.length;i++){
				console.log('In for: ');
				var price = productID[i].price*quantity[i];
				unitprice.push(price);
				totalprice+=price;
				console.log('price: ' + price);
				console.log('price: ' + totalprice);
			}
			var orderlist =[];
			var all_items = '';
			for (var i=0;i<productID.length;i++){
				var orderdetail =[];
				orderdetail.push(productID[i]);
				orderdetail.push(size[i]);
				orderdetail.push(quantity[i]);
				orderdetail.push(unitprice[i]);
				orderlist.push(orderdetail);
			}
			
			////////////////
			pag_content = '';
				pag_navigation = '';
			
				page = parseInt(req.body.data.page);
				
				max = parseInt(req.body.data.max);
				
				i//ndex = parseInt(req.body.data.index);
				
				
				cur_page = page;
				page -= 1;
				per_page = max ? max : 20; 
				previous_btn = true;
				next_btn = true;
				first_btn = true;
				last_btn = true;
				start = page * per_page;
			
				
			
			
			var count = '';
			count = orderlist.length;

			async.parallel([
				function(callback) {
					
						var item = [];
						for (var i=start;i<orderlist.length;i++){
							if (i > (start + per_page + 1)){
								break;
							}
							else{
								var itemdetail={
									image: orderlist[i][0].imagePath[0],
									size: orderlist[i][1],
									unitprice: orderlist[i][0].price,
									quantity: orderlist[i][2],
									totalprice: orderlist[i][3]
								};
								item.push(itemdetail);
							}
						}
						all_items = item;
						callback();
				}
			],function(err) { //This is the final callback

				if( count ){
					console.log('count:' +count);
					console.log('all items ngoài for:' + all_items);
					var dem=0;
					var open=false;
					
					for (var key in all_items) {
						pag_content += '<tr>'+
										'<td>' + dem + '</td>'+
										'<td><img width="100" src="' + all_items[key].image + '" alt=""></td>'+
										'<td>' + all_items[key].size + '</td>'+
                  
										'<td>$' + all_items[key].unitprice + '</td>'+
										'<td>'+

										'<input class="span1" style="max-width:34px" placeholder="1" id="appendedInputButtons" size="16" type="number" value="' + all_items[key].quantity + '" name="qty">'+
				 
										'</td>'+
										'<td>$' + all_items[key].totalprice + '</td>'+
										'<td><a href="/order/remove/' + dem + '" class="btn btn-danger"><span class="icon-trash"></span></a> </td>'+
										'</tr>';
						dem++;
					}//for
				}//if count
				
				
				
				no_of_paginations = Math.ceil(count / per_page);

				if (cur_page >= 7) {
					start_loop = cur_page - 3;
					if (no_of_paginations > cur_page + 3)
						end_loop = cur_page + 3;
					else if (cur_page <= no_of_paginations && cur_page > no_of_paginations - 6) {
						start_loop = no_of_paginations - 6;
						end_loop = no_of_paginations;
					} else {
						end_loop = no_of_paginations;
					}
				} else {
					start_loop = 1;
					if (no_of_paginations > 7)
						end_loop = 7;
					else
						end_loop = no_of_paginations;
				}
				  
				pag_navigation += "<ul>";

				if (first_btn && cur_page > 1) {
					pag_navigation += "<li p='1' class='active'>First</li>";
				} else if (first_btn) {
					pag_navigation += "<li p='1' class='inactive'>First</li>";
				} 

				if (previous_btn && cur_page > 1) {
					pre = cur_page - 1;
					pag_navigation += "<li p='" + pre + "' class='active'>Previous</li>";
				} else if (previous_btn) {
					pag_navigation += "<li class='inactive'>Previous</li>";
				}
				for (i = start_loop; i <= end_loop; i++) {

					if (cur_page == i)
						pag_navigation += "<li p='" + i + "' class = 'selected' >" + i + "</li>";
					else
						pag_navigation += "<li p='" + i + "' class='active'>" + i + "</li>";
				}
				
				if (next_btn && cur_page < no_of_paginations) {
					nex = cur_page + 1;
					pag_navigation += "<li p='" + nex + "' class='active'>Next</li>";
				} else if (next_btn) {
					pag_navigation += "<li class='inactive'>Next</li>";
				}

				if (last_btn && cur_page < no_of_paginations) {
					pag_navigation += "<li p='" + no_of_paginations + "' class='active'>Last</li>";
				} else if (last_btn) {
					pag_navigation += "<li p='" + no_of_paginations + "' class='inactive'>Last</li>";
				}

				pag_navigation = pag_navigation + "</ul>";
				
				var response = {
					'content': pag_content,
					'navigation' : pag_navigation
				};
				
				res.send(response);
				
			});
			////////////////
			
			
			
			if (messages.length > 0){
			res.render('UserView/orderlist', {
				title: 'Shopping Mall',
				userProfile: userProfile,
				brands: brands,
				categories: categories,
				totalprice: totalprice,
				orderlist: orderlist,
				items: items,
				messages: messages, hasErrors: messages.length > 0,
				layout: 'UserView/layout'
				});
			}
			else{
				if(req.isAuthenticated()){
					res.render('UserView/orderinfo', {
					title: 'Shopping Mall',
					userProfile: userProfile,
					brands: brands,
					categories: categories,
					items: items,
					layout: 'UserView/layout'
					});
				}
				else{
					res.redirect('/user/signin');
				}
				}
				


};
*/
exports.save_order_list_get = function (req,res,next) {
	var userProfile = req.user;
	var productID = [];
	var size = [];
	var quantity = [];
	productID=req.session.productID || [];	
	size=req.session.size || [];	
	quantity=req.session.quantity || [];
	var items = 0;
	if (productID.length > 0)
		items = productID.length;
			
		brandController.get_list_brands(function(err, brands) {
			console.log('Brands: ' + brands);
			categoryController.get_list_categories(function(err, categories) {
			console.log('Categories: ' + categories);
			
			res.render('UserView/orderinfo', {
				title: 'Shopping Mall',
				userProfile: userProfile,
				brands: brands,
				categories: categories,
				items: items,
				layout: 'UserView/layout'
				});
			});
		
		});

};
exports.save_order_list_post = function (req,res,next) {
	var userProfile = req.user;
	var productID = [];
	var size = [];
	var quantity = [];
	var messages =[];
	req.checkBody('address', 'Address is require').notEmpty();
	req.checkBody('phone', 'Phone is require').notEmpty();
	var errors = req.validationErrors();
	if (errors){
		errors.forEach(function(error){
			messages.push(error.msg);
		});
	}
	productID=req.session.productID || [];	
	size=req.session.size || [];	
	quantity=req.session.quantity || [];
	var items = 0;
	items = productID.length;
			
		brandController.get_list_brands(function(err, brands) {
			console.log('Brands: ' + brands);
			categoryController.get_list_categories(function(err, categories) {
			console.log('Categories: ' + categories);
			if (messages.length > 0){
			res.render('UserView/orderinfo', {
				title: 'Shopping Mall',
				userProfile: userProfile,
				brands: brands,
				categories: categories,
				items: items,
				messages: messages, hasErrors: messages.length > 0,
				layout: 'UserView/layout'
				});
			}
			else{
				//save order
				var idpro =[];
				for (var i=0;i<productID.length;i++){
				idpro.push(productID[i]._id);
				console.log('productID: ' + idpro);
				}
			
				var currentdate = getcurrentDate();
				/*currentdate.getDate() + "/"
                + (currentdate.getMonth()+1)  + "/"
                + currentdate.getFullYear() + " "
                + currentdate.getHours() + ":"
                + currentdate.getMinutes() + ":"
                + currentdate.getSeconds();*/
				var orders = Order({
					productID: idpro,
                    order_code: makeid_order(),
					userID: userProfile._id,
					size: size,
					quantity: quantity,
					time: currentdate,
					phone: req.body.phone,
					address: req.body.address,
					status: 'pending'
				});
				
				var isSave = false;
				isSave = orders.save(function(err) {
						if (err) {
							console.log('Order create error:' + err);
							return false; 
						}
					  console.log('Order created!');
					  return true;
				});
				
				if(isSave){
					for (var i=0;i<productID.length;i++){
					for (var j=0;j<productID[i].size.length;j++){
						if (productID[i].size[j]==size[i]){//update quantity after ordering
							productID[i].quantity[j] -= quantity[i];
						}
					}
					console.log('update quantity: '+ productID[i].quantity);
					Product.findByIdAndUpdate(productID[i]._id,{$set:{ quantity: productID[i].quantity }},{ new: true },function(err,updateprod){
						 if (err){
							console.log('Update product error:' + err);
							throw err;
						 }
					});
					}
				}
				
				productID=[];
				size = [];
				quantity = [];
				req.session.productID = productID;	
				req.session.size= size;	
				req.session.quantity = quantity;
				res.redirect('/');
			}
			});
		
		});

};

exports.order_list_get_admin = function (req,res,next) {
	var userProfile = req.user;

	async.parallel({
		order_list: function (callback) {
			Order.find({}).sort({time: 1}).exec(callback);
        },
		user_list: function (callback) {
			User.find({}).sort({_id: 1}).exec(callback);
        },
	}, function (err,results) {
		if(err)
		{
			res.send(404);
		}
		else
		{
            var order_list = [];
			results.order_list.forEach(function(order)
			{
				var user_name='unknown';
				results.user_list.forEach(function(user){
					if (order.userID == user._id)
					{
						user_name = user.name;
					}
				});

				var m_order = {
					_id: order._id,
					code: order.order_code,
					customer: user_name,
					date: order.time,
					status: order.status
				};
				order_list.push(m_order);
			});
			res.render('AdminView/orderlist',{
				title: 'Admin Shopping Mall',
                userProfile: userProfile,
				orders: order_list,
				layout: 'AdminView/layout'
			});
		}
    });
};

exports.order_list_post_admin = function (req,res,next) {
	//console.log(req.body.id);
	var list_id = [];
	list_id =list_id.concat(req.body.id);
	console.log(list_id);
	Order.remove({_id: list_id}).exec(function (err) {
		if (err)
		{
			res.end("<h1>404 Not found</h1>");

		}
    });
	res.redirect('/order_list');
};

exports.get_detail_order_list_get = function (req,res,next) {
	var id = req.params.id;
	console.log(id);
	var userProfile = req.user;
	Order.findOne({"_id": id}).exec(function (err,order) {
		if (err)
			res.send(404);
		if (order != null && order != undefined) {
            var user_name = 'unknown';
            async.parallel({
                findUser: function (callback) {
                    User.findOne({_id: order.userID}).exec(callback);
                },
                findProducts: function (callback) {
                    Product.find({_id: order.productID}).exec(callback);
                },
            }, function (err, results) {
                var products = [];
                console.log(order);
                var size = order["size"];
                var quantity = order["quantity"];
                console.log(size);
                console.log(quantity);
                if (results.findUser.name != undefined && results.findUser.name != null) {
                    name = results.findUser.name;
                }
                for (var i = 0; i < results.findProducts.length; i++) {
                    var m_product = {
                        title: results.findProducts[i].title,
                        size: size[i],
                        quantity: quantity[i],
						price: results.findProducts[i].price
                    };
                    products.push(m_product);
                }
                console.log(products);
				var total = 0;
				for (var i =0;i<products.length;i++)
				{
					total += parseFloat(products[i].quantity) * parseFloat(products[i].price);
				}
				console.log("Total: "+ total);
                var m_order = {
                    code: order.order_code,
                    customer: name,
                    time: order.time,
                    phone: order.phone,
                    address: order.address,
                    status: order.status,
                    products: products,
					total: total
                };
                console.log(m_order);
                res.render('AdminView/orderdetail', {
                    title: 'Admin Shopping Mall',
                    userProfile: userProfile,
                    order: m_order,
                    layout: 'AdminView/layout'
                });
            });
        }
        else
		{
			res.send(404);
		}
		//res.send(200);
    });

};

exports.get_detail_order_list_post = function (req,res,next) {
	id = req.params.id;
	var status = req.body.status_order;
	Order.findOne({'_id': id}).exec(function (err,order) {

        if (status == 'pending' || status == 'shipping' || status == 'delivered') {
            var order_instance = new Order({
                _id: id,
                status: status,
				quantity: order.quantity,
				size: order.size,
				productID: order.productID
            });
            Order.findByIdAndUpdate(id, order_instance, {}).exec(function (err, order) {
                if (err) {
                    res.end('<h1>Cannot update status of order</h1>');
                }
            });
            res.redirect('/order_list');
        }
        else {
            res.end('<h1>Cannot update status of this order</h1>');
        }
    });
};

exports.statistic_order_time_get = function (req,res,next) {
    var userProfile = req.user;
	async.parallel({
		orderlist: function(callback){
			Order.find({}).sort({time: 1}).exec(callback);
        },
		productlist: function (callback) {
			Product.find({}).exec(callback);
        },
	}, function (err,results) {
		var arr_orderlist = results.orderlist;
		var arr_productlist = results.productlist;
		var arr_m_order=[];

		//console.log(arr_orderlist);
		var date = new Date();
		var year = date.getFullYear();

		for (var i = 0; i<arr_orderlist.length;i++)
		{
			if (arr_orderlist[i].time.includes(year)) {
                var arr_product = arr_orderlist[i].productID;
                var arr_quantity = arr_orderlist[i].quantity;
                console.log(arr_product);
                console.log(arr_quantity);
                var total = 0;
                for (var ii = 0; ii < arr_product.length; ii++) {

                    for (var j = 0; j < arr_productlist.length; j++) {
                        if (arr_product[ii] == arr_productlist[j]._id) {
                            total = total + arr_quantity[ii] * arr_productlist[j].price;

                            break;
                        }
                    }
                }
                var m_order = {
                    id: arr_orderlist[i]._id,
                    time: arr_orderlist[i].time,
                    total: total
                };
                arr_m_order.push(m_order);
            }
		}

        var year_statistic = [];
        year_statistic.push(0);
        year_statistic.push(0);
        year_statistic.push(0);
        year_statistic.push(0);
        year_statistic.push(0);
        year_statistic.push(0);
        year_statistic.push(0);
        year_statistic.push(0);
        year_statistic.push(0);
        year_statistic.push(0);
        year_statistic.push(0);
        year_statistic.push(0);


        for (var i = 0;i < arr_m_order.length;i++)
        {
            console.log(arr_m_order[i].time);
            var arr_time = arr_time_create(arr_m_order[i].time);
            switch (arr_time[1])
            {
                case "01":
                    year_statistic[0] += arr_m_order[i].total;
                    break;
                case "02":
                    year_statistic[1] += arr_m_order[i].total;
                    break;
                case "03":
                    year_statistic[2] += arr_m_order[i].total;
                    break;
                case "04":
                    year_statistic[3] += arr_m_order[i].total;
                    break;
                case "05":
                    year_statistic[4] += arr_m_order[i].total;
                    break;
                case "06":
                    year_statistic[5] += arr_m_order[i].total;
                    break;
                case "07":
                    year_statistic[6] += arr_m_order[i].total;
                    break;
                case "08":
                    year_statistic[7] += arr_m_order[i].total;
                    break;
                case "09":
                    year_statistic[8] += arr_m_order[i].total;
                    break;
                case "10":
                    year_statistic[9] += arr_m_order[i].total;
                    break;
                case "11":
                    year_statistic[10] += arr_m_order[i].total;
                    break;
                case "12":
                    year_statistic[11] += arr_m_order[i].total;
                    break;

            }

        }
		console.log(arr_m_order);
		console.log(year_statistic);
        res.render('AdminView/statistictime',{

            title: 'Admin Shopping Mall',
            userProfile: userProfile,
            year: year,
            years_statistic: year_statistic,
            layout: 'AdminView/layout'

        });
    });

};

exports.statistic_order_time_post = function (req,res,next) {
	console.log(req.body.statistic);

	var type_statistic = req.body.statistic;
    var userProfile = req.user;
    async.parallel({
        orderlist: function(callback){
            Order.find({}).sort({time: 1}).exec(callback);
        },
        productlist: function (callback) {
            Product.find({}).exec(callback);
        },
    }, function (err,results) {
        var arr_orderlist = results.orderlist;
        var arr_productlist = results.productlist;
        var arr_m_order = [];

        //console.log(arr_orderlist);
        var date = new Date();
        var year = date.getFullYear();

        for (var i = 0; i < arr_orderlist.length; i++)
        {

			var arr_product = arr_orderlist[i].productID;
			var arr_quantity = arr_orderlist[i].quantity;
			console.log(arr_product);
			console.log(arr_quantity);
			var total = 0;
			for (var ii = 0; ii < arr_product.length; ii++) {

				for (var j = 0; j < arr_productlist.length; j++) {
					if (arr_product[ii] == arr_productlist[j]._id) {
						total = total + arr_quantity[ii] * arr_productlist[j].price;

						break;
					}
				}
			}
			var m_order = {
				id: arr_orderlist[i]._id,
				time: arr_orderlist[i].time,
				total: total
			};
			arr_m_order.push(m_order);
		}
		var arr_date_order = [];			//mang luu doanh thu cua 1 ngay
        arr_date_order.push(arr_m_order[0]);
        //console.log(arr_date_order);
		//Lay hoa don cua nhung ngay trung nhau
        for (var i=1; i < arr_m_order.length; i++)
		{
			var m_order_time = arr_m_order[i].time.split(" ")[0];
			console.log(m_order_time);
			var ishave = false;
			for (var j=0; j <arr_date_order.length;j++)
			{
				var date_order_time = arr_date_order[j].time.split(" ")[0];
				console.log(date_order_time);
				if (m_order_time == date_order_time)
				{
					arr_date_order[j].total += arr_m_order[i].total;
					ishave =true;
					break;
				}
			}
			if (ishave == false)
			{
				arr_date_order.push(arr_m_order[i]);
			}
		}
		//
        var messages=[];
        switch (type_statistic)
        {
            case "year":



            	console.log(req.body.year);
				req.checkBody('year','Please choose and fill year').notEmpty();
				req.checkBody('year','Year invalid').isNumeric();
                var errors = req.validationErrors();
                if (errors) {

                    errors.forEach(function (error) {
                        messages.push(error.msg);
                    });
                }
                if (messages.length < 1)
				{
					var year_select = req.body.year;
					var year_statistic = Order_12_month(arr_date_order,year_select);
					console.log(year_statistic);
                    res.render('AdminView/statistictime',{

                        title: 'Admin Shopping Mall',
                        userProfile: userProfile,
                        //chart: chart,
						year: year_select,
                        years_statistic: year_statistic,
                        layout: 'AdminView/layout'

                    });
				}
				else
				{
                    res.end("<h1><Please retype your year</h1>");
					console.log(messages);
				}
                break;
            case "date":
                console.log(new Date());
                console.log(req.body.datestart);
				console.log(req.body.dateend);


                console.log(req.body.year);
                req.checkBody('datestart','Start date is required').notEmpty();
                req.checkBody('dateend','End date is required').notEmpty;
                var errors = req.validationErrors();
                if (errors) {

                    errors.forEach(function (error) {
                        messages.push(error.msg);
                    });
                }
                if (messages.length <1) {
                    var startdate = req.body.datestart;
                    var enddate = req.body.dateend;
                    if (startdate > enddate) {
                        res.end("<h1>ERRO: Start date larger than end date </h1>");
                        break;
                    }
                    var range = startdate + " to " + enddate;
                    var range_statistic = OrderAtRange(arr_date_order, startdate, enddate);
                    res.render('AdminView/statistictime', {

                        title: 'Admin Shopping Mall',
                        userProfile: userProfile,
                        //chart: chart,
                        range: range,
                        range_statistic: range_statistic,
                        layout: 'AdminView/layout'

                    });
                }
                else
				{
					res.end("<h1>Please fill follow format YYYY/MM/dd</h1>");
				}
				//res.sendStatus(200);
                break;
            case "week":
            	console.log(req.body.week);
                req.checkBody('week','week is required').notEmpty();
                var errors = req.validationErrors();
                if (errors) {

                    errors.forEach(function (error) {
                        messages.push(error.msg);
                    });
                }
                if (messages.length<1) {

                    var arr_week = req.body.week.split("-W");
                    console.log("Weeek");
                    var start = getDateOfWeek(parseInt(arr_week[1]), parseInt(arr_week[0])).addDays(2);
                    var end = start.addDays(6);
                    var startdate = start.toJSON().split("T")[0];
                    var enddate = end.toJSON().split("T")[0];

                    var range = startdate + " to " + enddate;
                    var range_statistic = OrderAtRange(arr_date_order, startdate, enddate);
                    res.render('AdminView/statistictime', {

                        title: 'Admin Shopping Mall',
                        userProfile: userProfile,
                        //chart: chart,
                        range: range,
                        range_statistic: range_statistic,
                        layout: 'AdminView/layout'

                    });
                }
                else
				{
                    res.end("<h1>Please choose week</h1>");
				}
               // OrderAtWeek(arr_date_order,1,2017);
                //res.sendStatus(200);
                break;
            case "month":
                req.checkBody('month','Month is required').notEmpty();
                var errors = req.validationErrors();
                if (errors) {

                    errors.forEach(function (error) {
                        messages.push(error.msg);
                    });
                }
                if (messages.length<1) {
                    console.log(req.body.month);
                    var month_statistic = OrderAtMonth(arr_date_order, req.body.month);
                    res.render('AdminView/statistictime', {

                        title: 'Admin Shopping Mall',
                        userProfile: userProfile,
                        //chart: chart,
                        month: req.body.month,
                        month_statistic: month_statistic,
                        layout: 'AdminView/layout'

                    });
                }
                else
				{
                    res.end("<h1>Please choose a month</h1>");
				}
                //console.log(new Date().getMonth());

                break;
            case "quater":
                req.checkBody('quater','Quater is required').notEmpty();
                var errors = req.validationErrors();
                if (errors) {

                    errors.forEach(function (error) {
                        messages.push(error.msg);
                    });
                }
                if (messages.length<1) {
                    console.log(req.body.quater);
                    var arr_quater = req.body.quater.split("/");
                    var quater_statistic = OrderAtQuater(arr_date_order, parseInt(arr_quater[0]), arr_quater[1]);
                    switch (parseInt(arr_quater[0])) {
                        case 1:
                            res.render('AdminView/statistictime', {

                                title: 'Admin Shopping Mall',
                                userProfile: userProfile,
                                quater: req.body.quater,
                                quater1: true,
                                quater_statistic: quater_statistic,
                                layout: 'AdminView/layout'

                            });
                            break;
                        case 2:
                            res.render('AdminView/statistictime', {

                                title: 'Admin Shopping Mall',
                                userProfile: userProfile,
                                quater: req.body.quater,
                                quater2: true,
                                quater_statistic: quater_statistic,
                                layout: 'AdminView/layout'

                            });
                            break;
                        case 3:
                            res.render('AdminView/statistictime', {

                                title: 'Admin Shopping Mall',
                                userProfile: userProfile,
                                quater: req.body.quater,
                                quater3: true,
                                quater_statistic: quater_statistic,
                                layout: 'AdminView/layout'

                            });
                            break;
                        case 4:
                            res.render('AdminView/statistictime', {

                                title: 'Admin Shopping Mall',
                                userProfile: userProfile,
                                quater: req.body.quater,
                                quater4: true,
                                quater_statistic: quater_statistic,
                                layout: 'AdminView/layout'

                            });
                            break;

                    }
                }
                else
				{
					res.end("<h1>Please fill flowing format QUATER/YYYY</h1>");
				}
                break;
            default:
                console.log("Please select");
                res.sendStatus(404);
                break;
        }

    });


	/*res.render('AdminView/statistictime',{

        title: 'Admin Shopping Mall',
        userProfile: userProfile,
        //chart: chart,
        //years_statistic: year_statistic,
        layout: 'AdminView/layout'

    });*/
};


function getDateOfWeek(weekNumber, year) {
    return new Date(year, 0, 1+((weekNumber-1)*7));
}
Date.prototype.addDays = function(days) {
    var dat = new Date(this.valueOf());
    dat.setDate(dat.getDate() + days);
    return dat;
}
function makeid_order()
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    for( var i=0; i < 12; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
};

function OrderAtWeek(arr_m_order,week,year) {
    return new Date(year, 0, 1+((week-1)*7));

}
function OrderAtQuater(arr_m_order,quater,year) {

	var year_statistic = Order_12_month(arr_m_order,year);

	var quater_statistic = [];
	switch (quater) {
        case 1:
			quater_statistic.push(year_statistic[0]);
            quater_statistic.push(year_statistic[1]);
            quater_statistic.push(year_statistic[2]);

			break;
        case 2:
            quater_statistic.push(year_statistic[3]);
            quater_statistic.push(year_statistic[4]);
            quater_statistic.push(year_statistic[5]);

            break;
        case 3:
            quater_statistic.push(year_statistic[6]);
            quater_statistic.push(year_statistic[7]);
            quater_statistic.push(year_statistic[8]);

            break;
        case 4:
            quater_statistic.push(year_statistic[9]);
            quater_statistic.push(year_statistic[10]);
            quater_statistic.push(year_statistic[11]);

            break;
    }
    return quater_statistic;
	
}
function OrderAtRange(arr_m_order,startDate,endDate) {
	var range_date = getlistdate(startDate,endDate);
	var order_range_date = [];
	for (var i = 0;i<range_date.length;i++)
	{
		var order_date = {
			time: range_date[i],
			total: 0
		}
		order_range_date.push(order_date);
	}
    for (var i = 0; i <arr_m_order.length;i++)
    {
        //var arr_time = arr_time_create(arr_m_order[i].time);
        for (var j=0;j<order_range_date.length;j++) {
            if (arr_m_order[i].time.includes(order_range_date[j].time))
            {
                order_range_date[j].total = arr_m_order[i].total;
            }
        }

    }
    //console.log(order_range_date);
    return order_range_date;
}
function OrderAtMonth(arr_m_order,monthyear) {
    var arr_month = monthyear.split("-");
    //console.log(arr_month);
    var monthn = parseInt(arr_month[1])-1;
	var lastdate = new Date(parseInt(arr_month[0]), monthn+1, 1);
	var arr_generate_date = [];
	var tmplastdate = arr_time_create_fromJSON(lastdate.toJSON());
	var month_statistic = [];
	for(var i=1;i<=parseInt(tmplastdate[2]);i++)
	{
		var m_generate = monthyear+"-"+inttoString(i);
		//arr_generate_date.push(m_generate);
		var m_month_statistic = {
			time: m_generate,
			total: 0
		};
		month_statistic.push(m_month_statistic);
    }
	console.log(arr_m_order);
	for (var i = 0; i <arr_m_order.length;i++)
	{
        //var arr_time = arr_time_create(arr_m_order[i].time);
        for (var j=0;j<month_statistic.length;j++) {
            if (arr_m_order[i].time.includes(month_statistic[j].time))
            {
            	month_statistic[j].total = arr_m_order[i].total;
            }
        }

	}
    console.log(month_statistic);
	return month_statistic;

};
function Order_12_month(arr_m_order,year) {
    var year_statistic = [];
    year_statistic.push(0);
    year_statistic.push(0);
    year_statistic.push(0);
    year_statistic.push(0);
    year_statistic.push(0);
    year_statistic.push(0);
    year_statistic.push(0);
    year_statistic.push(0);
    year_statistic.push(0);
    year_statistic.push(0);
    year_statistic.push(0);
    year_statistic.push(0);


    for (var i = 0;i < arr_m_order.length;i++)
    {
       // console.log(arr_m_order[i].time);

        var arr_time = arr_time_create(arr_m_order[i].time);
        if (arr_time[0] == year) {
            switch (arr_time[1]) {
                case "01":
                    year_statistic[0] += arr_m_order[i].total;
                    break;
                case "02":
                    year_statistic[1] += arr_m_order[i].total;
                    break;
                case "03":
                    year_statistic[2] += arr_m_order[i].total;
                    break;
                case "04":
                    year_statistic[3] += arr_m_order[i].total;
                    break;
                case "05":
                    year_statistic[4] += arr_m_order[i].total;
                    break;
                case "06":
                    year_statistic[5] += arr_m_order[i].total;
                    break;
                case "07":
                    year_statistic[6] += arr_m_order[i].total;
                    break;
                case "08":
                    year_statistic[7] += arr_m_order[i].total;
                    break;
                case "09":
                    year_statistic[8] += arr_m_order[i].total;
                    break;
                case "10":
                    year_statistic[9] += arr_m_order[i].total;
                    break;
                case "11":
                    year_statistic[10] += arr_m_order[i].total;
                    break;
                case "12":
                    year_statistic[11] += arr_m_order[i].total;
                    break;

            }
        }
    }
    //console.log(arr_m_order);

    return year_statistic;
}
function inttoString(num) {
    var n = num.toString();
    if (n.length ==1)
    {
        n = "0"+n;
    }
    return n;
}

function getlistdate(startDate,endDate) {

    var listDate = [];

    var dateMove = new Date(startDate);
    var strDate = startDate;

    while (strDate < endDate){
        var strDate = dateMove.toISOString().slice(0,10);
        listDate.push(strDate);
        dateMove.setDate(dateMove.getDate()+1);
    };
    return listDate;
}
function arr_time_create(stringtime)
{
    var arr = stringtime.split("-");

    var arr = arr.concat(arr[2].split(" "));
    arr.splice(2, 1);
    return arr;
};

function arr_time_create_fromJSON(stringtime)
{
    var arr = stringtime.split("-");

    var arr = arr.concat(arr[2].split("T"));
    arr.splice(2, 1);
    return arr;
};
Date.prototype.addHours= function(hours){
    this.setHours(this.getHours()+hours);
    return this;
};
function getcurrentDate() {
    var currentdate = new Date().addHours(7);
    var datetime = currentdate.toJSON();
    datetime = datetime.replace("T"," ");
    var arr = datetime.split(".");
    return arr[0];

};
exports.get_order_history = function (req,res) {
			var userProfile = req.user;
			brandController.get_list_brands(function(err, brands) {
			console.log('Brands: ' + brands);
			categoryController.get_list_categories(function(err, categories) {
			console.log('Categories: ' + categories);
			
				async.parallel({
					order_list: function (callback) {
						Order.find({ userID: userProfile._id }).sort({time: 1}).exec(callback);
					},
					product_list: function (callback) {
						Product.find({}).sort({_id: 1}).exec(callback);
					},
				}, function (err,results) {
					if(err)
					{
						res.send(404);
					}
					else
					{
						var order_list = [];
						var total=0;
						var items=0;
						results.order_list.forEach(function(order)
						{
							var user_name='unknown';
							var image='';
							var price=0;
							for (var i=0;i<order.productID.length;i++){
								items++;
							results.product_list.forEach(function(prod){
								if (order.productID[i] == prod._id)
								{
									image = prod.imagePath[0];
									price = prod.price;
								}
							});
							var totalprice = price*order.quantity[i];
							total+=totalprice;

							var m_order = {
								  date: order.time,
								  image: image,
								  size: order.size[i],
								  unitprice: price,
								  quantity: order.quantity[i],
								  totalprice: totalprice,
								  status: order.status
							};
							order_list.push(m_order);
						}
						});
						res.render('UserView/orderhistory',{
							title: 'Shopping Mall',
							userProfile: userProfile,
							brands: brands,
							categories: categories,
							order_list: order_list,
							item: items,
							totalprice: total,
							layout: 'UserView/layout'
						});
					}
				});
			});
		
		});

};

exports.get_order_remove = function (req,res,next) {
	var index = req.params.index;
	var productID = [];//lấy cả product
	var size = [];
	var quantity = [];
	productID=req.session.productID || [];	
	size=req.session.size || [];	
	quantity=req.session.quantity || [];
	productID.splice(index, 1);
	size.splice(index, 1);
	quantity.splice(index, 1);
	req.session.productID = productID;	
	req.session.size=size;	
	req.session.quantity=quantity;
	res.redirect('/order/orderlist');
	
};

var getListOrder = function (callback) {
	Order.find(function(err,orders){
		 if (err) {
            //console.log('Product not found');
            //callback(err? err: 'Product not found');
        } else {
            //callback(null, products);
			callback(null, orders);
        }
		//return doc2;
	});

};

module.exports.get_list_orders = getListOrder;
exports.statistic_order_product_get = function (req,res,next) {
   	var userProfile = req.user;
   	async.parallel({
		orderlist: function (callback) {
			Order.find({}).sort({time: 1}).exec(callback);
        },
		productlist: function (callback) {
			Product.find({}).exec(callback);
        },
        categorylist: function (callback) {
			Category.find({}).exec(callback);
        },
	}, function (err,results) {
		var arr_product = results.productlist;
		var arr_order = results.orderlist;
		var arr_category = results.categorylist;
		var product_statistic=[];
		//console.log(arr_order);
		for (var i=0;i<arr_product.length;i++)
		{
			var product_instance = {
				id: arr_product[i]._id,
				title: arr_product[i].title,
				count:0
			}

			for (var j =0;j<arr_order.length;j++)
			{
				var product_order = arr_order[j].productID;
				for (var ii = 0;ii<product_order.length;ii++)
				{
					if (product_instance.id == product_order[ii])
					{
						product_instance.count +=parseInt(arr_order[j].quantity[ii]);
					}
				}
			}
			if (product_instance.count != 0)
			{
				product_statistic.push(product_instance);
			}
		}
		for (var i =0;i<product_statistic.length-1;i++)
		{
			for (var j = i+1;j<product_statistic.length;j++)
			{
				if (product_statistic[j].count<product_statistic[i].count)
				{
					var tmp = product_statistic[i];
					product_statistic[i]=product_statistic[j];
					product_statistic[j] = tmp;
				}
			}
		}
		product_statistic.reverse();
		product_statistic.splice(10,product_statistic.length);

		console.log(product_statistic);
        res.render('AdminView/statisticsalesproduct',{

            title: 'Admin Shopping Mall',
            userProfile: userProfile,
			product: true,
            product_statistic: product_statistic,
            categories: arr_category,
            layout: 'AdminView/layout'

        });
    });

};

exports.statistic_order_product_post = function (req,res,next) {
    var userProfile = req.user;

    async.parallel({
        orderlist: function (callback) {
            Order.find({}).sort({time: 1}).exec(callback);
        },
        productlist: function (callback) {
            Product.find({}).exec(callback);
        },
        categorylist: function (callback) {
            Category.find({}).exec(callback);
        },
    }, function (err,results) {
        var arr_product = results.productlist;
        var arr_order = results.orderlist;
        var arr_category = results.categorylist;
        var type_statistic = req.body.statistic;
        switch (type_statistic)
		{
			case "products":
                var product_statistic=Gettop10Products(arr_product,arr_order);


                console.log(product_statistic);
                res.render('AdminView/statisticsalesproduct',{

                    title: 'Admin Shopping Mall',
                    userProfile: userProfile,
                    product: true,
                    product_statistic: product_statistic,
                    categories: arr_category,
                    layout: 'AdminView/layout'

                });
                break;
			case "category":
				var category = req.body.category
				console.log(category);
				if (category != undefined && category != null && category !='')
				{
                    var product_statistic=Gettop10ProductsofCategory(arr_product,arr_order,category);


                    console.log(product_statistic);
                    res.render('AdminView/statisticsalesproduct',{

                        title: 'Admin Shopping Mall',
                        userProfile: userProfile,
                        product: true,
                        product_statistic: product_statistic,
                        categories: arr_category,
                        layout: 'AdminView/layout'

                    });
				}
				else
				{
					res.end("<h1>Please choose category</h1>");
				}
				//res.sendStatus(200);
				break;
			default:
				res.end("<h1>Please choose an option</h1>");
        }

    });

   /* res.render('AdminView/statisticsalesproduct',{

        title: 'Admin Shopping Mall',
        userProfile: userProfile,
        //chart: chart,
        // year: year_select,
        // years_statistic: year_statistic,
        layout: 'AdminView/layout'

    });*/
};

function Gettop10Products(arr_product, arr_order) {
    var product_statistic=[];
    //console.log(arr_order);
    for (var i=0;i<arr_product.length;i++)
    {

        var product_instance = {
            id: arr_product[i]._id,
            title: arr_product[i].title,
            count:0
        }

        for (var j =0;j<arr_order.length;j++)
        {
            var product_order = arr_order[j].productID;
            for (var ii = 0;ii<product_order.length;ii++)
            {
                if (product_instance.id == product_order[ii])
                {
                    product_instance.count +=parseInt(arr_order[j].quantity[ii]);
                }
            }
        }
        if (product_instance.count != 0)
        {
            product_statistic.push(product_instance);
        }
    }
    for (var i =0;i<product_statistic.length-1;i++)
    {
        for (var j = i+1;j<product_statistic.length;j++)
        {
            if (product_statistic[j].count<product_statistic[i].count)
            {
                var tmp = product_statistic[i];
                product_statistic[i]=product_statistic[j];
                product_statistic[j] = tmp;
            }
        }
    }

    product_statistic.reverse();
    product_statistic.splice(10,product_statistic.length);
    return product_statistic;

}

function Gettop10ProductsofCategory(arr_product, arr_order,category) {
    var product_statistic=[];
    //console.log(arr_order);
    for (var i=0;i<arr_product.length;i++)
    {
		if(arr_product[i].category == category) {
            var product_instance = {
                id: arr_product[i]._id,
                title: arr_product[i].title,
                count: 0
            }

            for (var j = 0; j < arr_order.length; j++) {
                var product_order = arr_order[j].productID;
                for (var ii = 0; ii < product_order.length; ii++) {
                    if (product_instance.id == product_order[ii]) {
                        product_instance.count += parseInt(arr_order[j].quantity[ii]);
                    }
                }
            }
            if (product_instance.count != 0) {
                product_statistic.push(product_instance);
            }
        }
    }
    for (var i =0;i<product_statistic.length-1;i++)
    {
        for (var j = i+1;j<product_statistic.length;j++)
        {
            if (product_statistic[j].count<product_statistic[i].count)
            {
                var tmp = product_statistic[i];
                product_statistic[i]=product_statistic[j];
                product_statistic[j] = tmp;
            }
        }
    }

    product_statistic.reverse();
    product_statistic.splice(10,product_statistic.length);
    return product_statistic;

}