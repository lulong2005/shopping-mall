var Product = require ('../models/product');
var brandController = require('./brandController');
var categoryController = require('./categoryController');
var Paging = require ('../models/paging');
var userController=require('./userController');
var orderController=require('./orderController');
var commentController=require('./commentController');
var Comment = require ('../models/comment');
var async = require('async');
exports.get_list_product_home = function (req,res,next) {
	
	var userProfile = req.user;
	var productID = [];
	productID=req.session.productID || [];
	var items = 0;
	if (productID.length > 0)
		items = productID.length;
	brandController.get_list_brands(function(err, brands) {
		console.log('Brands: ' + brands);
		categoryController.get_list_categories(function(err, categories) {
		console.log('Categories: ' + categories);
		
		res.render('UserView/index', {
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

exports.get_list_product_home_post = function (req,res,next) {
	
			//////////////////////
				pag_content = '';
				pag_navigation = '';
			
				page = parseInt(req.body.data.page); /* Page we are currently at */
				
				max = parseInt(req.body.data.max); /* Number of items to display per page */
				
				
				cur_page = page;
				page -= 1;
				per_page = max ? max : 20; 
				previous_btn = true;
				next_btn = true;
				first_btn = true;
				last_btn = true;
				start = page * per_page;
			
				
			
			var all_items = '';
			var count = '';
			
			
			/* We use async task to make sure we only return data when all queries completed successfully */
			async.parallel([
				function(callback) {
					/* Use name and sort variables as field names */
					
					
					/* Retrieve all the posts */
					Product.find( function(err, docs){
						if (err) throw err;
						// console.log(docs);
						var item = [];
						for (var i=start;i<docs.length;i++){
							if (i > (start + per_page + 1)){
								break;
							}
							else{
								item.push(docs[i]);
							}
						}
						all_items = item;
						callback();
						
					});
				},
				function(callback) {
					Product.count(function(err, doc_count){
						if (err) throw err;
						// console.log(count);
						count = doc_count;
						callback();
					});
				}
			], function(err) { //This is the final callback
				/* Check if our query returns anything. */
				if( count ){
					console.log('count:' +count);
					console.log('all items ngoài for:' + all_items);
					var dem=0;
					var open=false;
					
					for (var key in all_items) {
						
						if(dem%3==0 && open==false && dem< max){
							pag_content +='<ul class="thumbnails">';
							pag_content +=  '<li class="span4">'+
											'<div class="thumbnail">'+
											'<a href="/viewproduct/detail/'+all_items[key].id + '" class="overlay"></a>'+
											'<a class="zoomTool" href="/viewproduct/detail/' + all_items[key].id + '" title="add to cart"><span class="icon-search"></span>VIEW DETAIL</a>'+
											  '<a href="/viewproduct/detail/'+all_items[key].id+'"><img src="'+all_items[key].imagePath[0]+'" alt="..." ></a>'+
											  '<div class="caption cntr">'+
												'<p class="productTitle">'+all_items[key].title+'</p>'+
												'<p style = "color:#f89406"><strong> $'+all_items[key].price+'</strong></p>'+
												'<h4><a class="shopBtn" href="/viewproduct/detail/'+all_items[key].id + '" title="add to cart"> VIEW DETAIL </a></h4>'+
											  '</div>'+
											  '</div>'+
											  '</li>';
							open=true;
						}
						
						if(dem%3!=0)
						{
							pag_content +=  '<li class="span4">'+
											'<div class="thumbnail">'+
											'<a href="/viewproduct/detail/'+all_items[key].id + '" class="overlay"></a>'+
											'<a class="zoomTool" href="/viewproduct/detail/' + all_items[key].id + '" title="add to cart"><span class="icon-search"></span>VIEW DETAIL</a>'+
											  '<a href="/viewproduct/detail/'+all_items[key].id+'"><img src="'+all_items[key].imagePath[0]+'" alt="..." ></a>'+
											  '<div class="caption cntr">'+
												'<p class="productTitle">'+all_items[key].title+'</p>'+
												'<p style = "color:#f89406"><strong> $'+all_items[key].price+'</strong></p>'+
												'<h4><a class="shopBtn" href="/viewproduct/detail/'+all_items[key].id + '" title="add to cart"> VIEW DETAIL </a></h4>'+
											  '</div></div></li>';
						}//if
						if (dem%3==2 && open==true){
							pag_content += '</ul>';
							open=false;
							
						}
						if (dem== max -1){
							break;
						}
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
			//var paging = Paging.pagination();
			//console.log('paging value of current_page: ' + paging.get_config('current_page'));
			///////////////////////
	
};

exports.get_list_product_category = function (req,res,next) {
	var userProfile = req.user;
	var productID = [];
	productID=req.session.productID || [];
	var items = 0;
	if (productID.length > 0)
		items = productID.length;
	var query = Product.find( { category: req.params.id } );
	query.exec(function(err,docs){
		console.log('ID category: ' + req.params.id);
		console.log('products by category: ' + docs);
		var productChunks = [];
		var chunkSize = 3;
		for (var i=0;i< docs.length;i+= chunkSize){
			productChunks.push(docs.slice(i,i+ chunkSize));
		}
		brandController.get_list_brands(function(err, brands) {
			console.log('Brands: ' + brands);
			categoryController.get_list_categories(function(err, categories) {
			console.log('Categories: ' + categories);
			
			res.render('UserView/index', {
				title: 'Shopping Mall',
				products: productChunks,
				userProfile: userProfile,
				brands: brands,
				categories: categories,
				items: items,
				layout: 'UserView/layout'
				});
			});
		
		});
		
	});
};

exports.get_list_product_category_post = function (req,res,next) {
	pag_content = '';
				pag_navigation = '';
			
				page = parseInt(req.body.data.page); /* Page we are currently at */
				
				max = parseInt(req.body.data.max); /* Number of items to display per page */
				
				
				cur_page = page;
				page -= 1;
				per_page = max ? max : 20; 
				previous_btn = true;
				next_btn = true;
				first_btn = true;
				last_btn = true;
				start = page * per_page;
			
				
			
			var all_items = '';
			var count = '';
			
			
			/* We use async task to make sure we only return data when all queries completed successfully */
			async.parallel([
				function(callback) {
					/* Use name and sort variables as field names */
					
					
					/* Retrieve all the posts */
					Product.find( {category: req.params.id},function(err, docs){
						if (err) throw err;
						// console.log(docs);
						var item = [];
						for (var i=start;i<docs.length;i++){
							if (i > (start + per_page + 1)){
								break;
							}
							else{
								item.push(docs[i]);
							}
						}
						all_items = item;
						callback();
						
					});
				},
				function(callback) {
					Product.count({category: req.params.id},function(err, doc_count){
						if (err) throw err;
						// console.log(count);
						count = doc_count;
						callback();
					});
				}
			], function(err) { //This is the final callback
				/* Check if our query returns anything. */
				if( count ){
					console.log('count:' +count);
					console.log('all items ngoài for:' + all_items);
					var dem=0;
					var open=false;
					
					for (var key in all_items) {
						
						if(dem%3==0 && open==false && dem< max){
							pag_content +='<ul class="thumbnails">';
							pag_content +=  '<li class="span4">'+
											'<div class="thumbnail">'+
											'<a href="/viewproduct/detail/'+all_items[key].id + '" class="overlay"></a>'+
											'<a class="zoomTool" href="/viewproduct/detail/' + all_items[key].id + '" title="add to cart"><span class="icon-search"></span>VIEW DETAIL</a>'+
											  '<a href="/viewproduct/detail/'+all_items[key].id+'"><img src="'+all_items[key].imagePath[0]+'" alt="..." ></a>'+
											  '<div class="caption cntr">'+
												'<p class="productTitle">'+all_items[key].title+'</p>'+
												'<p style = "color:#f89406"><strong> $'+all_items[key].price+'</strong></p>'+
												'<h4><a class="shopBtn" href="/viewproduct/detail/'+all_items[key].id + '" title="add to cart"> VIEW DETAIL </a></h4>'+
											  '</div>'+
											  '</div>'+
											  '</li>';
							open=true;
						}
						
						if(dem%3!=0)
						{
							pag_content +=  '<li class="span4">'+
											'<div class="thumbnail">'+
											'<a href="/viewproduct/detail/'+all_items[key].id + '" class="overlay"></a>'+
											'<a class="zoomTool" href="/viewproduct/detail/' + all_items[key].id + '" title="add to cart"><span class="icon-search"></span>VIEW DETAIL</a>'+
											  '<a href="/viewproduct/detail/'+all_items[key].id+'"><img src="'+all_items[key].imagePath[0]+'" alt="..." ></a>'+
											  '<div class="caption cntr">'+
												'<p class="productTitle">'+all_items[key].title+'</p>'+
												'<p style = "color:#f89406"><strong> $'+all_items[key].price+'</strong></p>'+
												'<h4><a class="shopBtn" href="/viewproduct/detail/'+all_items[key].id + '" title="add to cart"> VIEW DETAIL </a></h4>'+
											  '</div></div></li>';
						}//if
						if (dem%3==2 && open==true){
							pag_content += '</ul>';
							open=false;
							
						}
						if (dem== max -1){
							break;
						}
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
};

exports.get_list_product_brand = function (req,res,next) {
	var userProfile = req.user;
	var productID = [];
	productID=req.session.productID || [];
	var items = 0;
	if (productID.length > 0)
		items = productID.length;
	var query = Product.find( { brand: req.params.id } );
	query.exec(function(err,docs){
		console.log('ID category: ' + req.params.id);
		console.log('products by category: ' + docs);
		var productChunks = [];
		var chunkSize = 3;
		for (var i=0;i< docs.length;i+= chunkSize){
			productChunks.push(docs.slice(i,i+ chunkSize));
		}
		brandController.get_list_brands(function(err, brands) {
			console.log('Brands: ' + brands);
			categoryController.get_list_categories(function(err, categories) {
			console.log('Categories: ' + categories);
			
			res.render('UserView/index', {
				title: 'Shopping Mall',
				products: productChunks,
				userProfile: userProfile,
				brands: brands,
				categories: categories,
				items: items,
				layout: 'UserView/layout'
				});
			});
		
		});
		
	});
};

exports.get_list_product_brand_post = function (req,res,next) {
	pag_content = '';
				pag_navigation = '';
			
				page = parseInt(req.body.data.page); /* Page we are currently at */
				
				max = parseInt(req.body.data.max); /* Number of items to display per page */
				
				
				cur_page = page;
				page -= 1;
				per_page = max ? max : 20; 
				previous_btn = true;
				next_btn = true;
				first_btn = true;
				last_btn = true;
				start = page * per_page;
			
				
			
			var all_items = '';
			var count = '';
			
			
			/* We use async task to make sure we only return data when all queries completed successfully */
			async.parallel([
				function(callback) {
					/* Use name and sort variables as field names */
					
					
					/* Retrieve all the posts */
					Product.find( {brand: req.params.id},function(err, docs){
						if (err) throw err;
						// console.log(docs);
						var item = [];
						for (var i=start;i<docs.length;i++){
							if (i > (start + per_page + 1)){
								break;
							}
							else{
								item.push(docs[i]);
							}
						}
						all_items = item;
						callback();
						
					});
				},
				function(callback) {
					Product.count({brand: req.params.id},function(err, doc_count){
						if (err) throw err;
						// console.log(count);
						count = doc_count;
						callback();
					});
				}
			], function(err) { //This is the final callback
				/* Check if our query returns anything. */
				if( count ){
					console.log('count:' +count);
					console.log('all items ngoài for:' + all_items);
					var dem=0;
					var open=false;
					
					for (var key in all_items) {
						
						if(dem%3==0 && open==false && dem< max){
							pag_content +='<ul class="thumbnails">';
							pag_content +=  '<li class="span4">'+
											'<div class="thumbnail">'+
											'<a href="/viewproduct/detail/'+all_items[key].id + '" class="overlay"></a>'+
											'<a class="zoomTool" href="/viewproduct/detail/' + all_items[key].id + '" title="add to cart"><span class="icon-search"></span>VIEW DETAIL</a>'+
											  '<a href="/viewproduct/detail/'+all_items[key].id+'"><img src="'+all_items[key].imagePath[0]+'" alt="..." ></a>'+
											  '<div class="caption cntr">'+
												'<p class="productTitle">'+all_items[key].title+'</p>'+
												'<p style = "color:#f89406"><strong> $'+all_items[key].price+'</strong></p>'+
												'<h4><a class="shopBtn" href="/viewproduct/detail/'+all_items[key].id + '" title="add to cart"> VIEW DETAIL </a></h4>'+
											  '</div>'+
											  '</div>'+
											  '</li>';
							open=true;
						}
						
						if(dem%3!=0)
						{
							pag_content +=  '<li class="span4">'+
											'<div class="thumbnail">'+
											'<a href="/viewproduct/detail/'+all_items[key].id + '" class="overlay"></a>'+
											'<a class="zoomTool" href="/viewproduct/detail/' + all_items[key].id + '" title="add to cart"><span class="icon-search"></span>VIEW DETAIL</a>'+
											  '<a href="/viewproduct/detail/'+all_items[key].id+'"><img src="'+all_items[key].imagePath[0]+'" alt="..." ></a>'+
											  '<div class="caption cntr">'+
												'<p class="productTitle">'+all_items[key].title+'</p>'+
												'<p style = "color:#f89406"><strong> $'+all_items[key].price+'</strong></p>'+
												'<h4><a class="shopBtn" href="/viewproduct/detail/'+all_items[key].id + '" title="add to cart"> VIEW DETAIL </a></h4>'+
											  '</div></div></li>';
						}//if
						if (dem%3==2 && open==true){
							pag_content += '</ul>';
							open=false;
							
						}
						if (dem== max -1){
							break;
						}
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
};

exports.get_product_detail = function (req,res,next) {
	var userProfile = req.user;
	var valuesize = req.body.selectSize;
	var qtyofsize_selected = req.body.quantity;
	var productID = [];
	productID=req.session.productID || [];
	var items = 0;
	if (productID.length > 0)
		items = productID.length;
	Product.findById(req.params.id).exec(function(err,docs){
		var view = docs.view + 1;
		docs.view = view;
		 docs.save(function(err) {
		  if (err)
			console.log('error')
		  else
			console.log('success')
		});
		
		var pos_size = 0;
		for (var i=0;i<docs.size.length;i++){
			if (docs.size[i]==valuesize){
				pos_size=i;//position of selected size
			}
		}
		var qtyofsize = docs.quantity[pos_size];
		var messages = [];
		if (qtyofsize_selected > 0 && qtyofsize_selected <= qtyofsize){
			console.log('select qty true');
			
		}
		else if (qtyofsize_selected > qtyofsize){
			console.log('Product quantity in stock is not enough. Please retype product quantity!');
			messages.push('Product quantity in stock is not enough. Please retype product quantity!');
		}
		else if (qtyofsize_selected <= 0){
			console.log('Invalid quantity');
			messages.push('Invalid quantity.  Please retype product quantity!');
		}
		var imagepath = [];
	for (var i=1;i<docs.imagePath.length;i++){
		imagepath.push(docs.imagePath[i]);
	}
	var qty = 0;
	for (var i=0;i<docs.quantity.length;i++){
		qty = qty + docs.quantity[i];
	}
	console.log('qty: ' + qty);
	var qtyresult='';
	if (qty==0){
		qtyresult = 'Out of stock';
	}
	else{
		qtyresult = qty + ' items in stock';
	}
	console.log('qtyresult: ' + qtyresult);
		brandController.get_list_brands(function(err, brands) {
			console.log('Brands: ' + brands);
			
			categoryController.get_list_categories(function(err, categories) {
			console.log('Categories: ' + categories);
			var category = '';
			categoryController.get_category_by_id(docs.category,function(err, category){
				brandController.get_brand_by_id(docs.brand,function(err, brand){
					commentController.get_comment_by_productid(req.params.id,function(err, comments){
					userController.get_list_users(function(err, users){
					orderController.get_list_orders(function(err, orders){
						Product.find(function(err, products){
							var proIdRelate = [];
							for(var i=0; i<orders.length;i++)
							{
								for(var j=0; j<orders[i].productID.length; j++)
								{
									if(orders[i].productID[j]==req.params.id)
									{
										for(var k=0; k<orders[i].productID.length; k++)
										{
											if(orders[i].productID[k]!=req.params.id)
											{
												proIdRelate.push(orders[i].productID[k]);
											}
										}
									}
								}
							}
							var proListRelate=[];
							for(var j=0; j<proIdRelate.length;j++)
							{
								for(var i=0; i<products.length; i++)
								{
									if(proIdRelate[j]==products[i]._id)
									{
										proListRelate.push(products[i]);
										break;
									}
								}
							}
					
					var listCommentGet=[];
					for(var i=0; i<comments.length; i++)
					{
						var detailComment=[];
						for(var j=0;j<users.length; j++)
						{
							if(comments[i].userID == users[j]._id)
							{
								detailComment.push(users[j]);
								detailComment.push(comments[i]);
								listCommentGet.push(detailComment);
							}
						}
					}
					var listComment=[];
					for(var i=listCommentGet.length-1; i>=0; i--)
					{
						listComment.push(listCommentGet[i]);
					}
				res.render('UserView/productdetail', {
				title: 'Shopping Mall',
				product: docs,
				userProfile: userProfile,
				brands: brands,
				categories: categories,
				imagepath: imagepath,
				category: category,
				brand: brand,
				qtyresult: qtyresult,
				items: items,
				messages: messages, hasErrors: messages.length > 0,
				view: view,
				listComment: listComment,
				proListRelate: proListRelate,
				layout: 'UserView/layout'
				});
				});
			});
			});
			});
			});
			});
		});
		});
		
	});
};

exports.add_to_cart = function (req,res,next) {
	var userProfile = req.user;
	var valuesize = req.body.selectSize;
	var qtyofsize_selected = req.body.quantity;
	var currentdate = new Date(); 
var datetime = currentdate.getDate() + "/"
                + (currentdate.getMonth()+1)  + "/" 
                + currentdate.getFullYear() + " "  
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds();
	console.log('Time: ' + datetime);
	if (req.body.btproduct == "Addtocart"){
	Product.findById(req.params.id).exec(function(err,docs){
		var pos_size = 0;
		for (var i=0;i<docs.size.length;i++){
			if (docs.size[i]==valuesize){
				pos_size=i;//position of selected size
			}
		}
		var qtyofsize = docs.quantity[pos_size];
		var messages = [];
		var items = 0;
		var itemscount = [];
		itemscount=req.session.productID || [];
		if (itemscount.length > 0){
			items=itemscount.length;
		}
		if (qtyofsize_selected > 0 && qtyofsize_selected <= qtyofsize){
			console.log('select qty true');
			var productID = [];
			var size = [];
			var quantity = [];
			productID=req.session.productID || [];
			productID.push(docs);
			req.session.productID = productID;
			
			size=req.session.size || [];
			size.push(valuesize);
			req.session.size = size;
			
			quantity=req.session.quantity || [];
			quantity.push(qtyofsize_selected);
			req.session.quantity = quantity;
			
			items = productID.length;
			
		}
		else if (qtyofsize_selected > qtyofsize){
			console.log('Product quantity in stock is not enough. Please retype product quantity!');
			messages.push('Product quantity in stock is not enough. Please retype product quantity!');
		}
		else if (qtyofsize_selected <= 0){
			console.log('Invalid quantity');
			messages.push('Invalid quantity.  Please retype product quantity!');
		}
		//res.redirect('/viewproduct/detail/' + req.params.id);
		
		var imagepath = [];
	for (var i=1;i<docs.imagePath.length;i++){
		imagepath.push(docs.imagePath[i]);
	}
	var qty = 0;
	for (var i=0;i<docs.quantity.length;i++){
		qty = qty + docs.quantity[i];
	}
	console.log('qty: ' + qty);
	var qtyresult='';
	if (qty==0){
		qtyresult = 'Out of stock';
	}
	else{
		qtyresult = qty + ' items in stock';
	}
	console.log('qtyresult: ' + qtyresult);
		brandController.get_list_brands(function(err, brands) {
			console.log('Brands: ' + brands);
			
			categoryController.get_list_categories(function(err, categories) {
			console.log('Categories: ' + categories);
			var category = '';
			categoryController.get_category_by_id(docs.category,function(err, category){
				
				brandController.get_brand_by_id(docs.brand,function(err, brand){
			res.render('UserView/productdetail', {
				title: 'Shopping Mall',
				product: docs,
				userProfile: userProfile,
				brands: brands,
				categories: categories,
				imagepath: imagepath,
				category: category,
				brand: brand,
				qtyresult: qtyresult,
				messages: messages, hasErrors: messages.length > 0,
				items: items,
				layout: 'UserView/layout'
				});
			});
			});
		});
		});
		
	});
	}
	
	if (req.body.btproduct == "Send"){
		var comment = req.body.comment;
		if (req.isAuthenticated()){
			console.log('Vào comment');
				var comments = Comment({
					productID: req.params.id,
					userID: userProfile._id,
					content: comment,
					time: datetime
					});

					comments.save(function(err) {
							if (err) {
								console.log('Comment create error:' + err);
								return false; 
							}
						  console.log('Comment created!');
						  return true;
					});
			res.redirect('/viewproduct/detail/' + req.params.id);
		}
		else{
			res.redirect('/user/signin');
		}
	}
};
exports.filter_get=function(req,res,next){
	var userProfile = req.user;
	var productID = [];
	productID=req.session.productID || [];
	var items = 0;
	if (productID.length > 0)
		items = productID.length;
	brandController.get_list_brands(function(err, brands) {
		console.log('Brands: ' + brands);
		categoryController.get_list_categories(function(err, categories) {
		console.log('Categories: ' + categories);
		
		res.render('UserView/index', {
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
exports.filter_post = function (req,res,next) {
	var isPrice=true;
	var isCate=true;
	var isBrand=true;
	
	pag_content = '';
	pag_navigation = '';

	page = parseInt(req.body.data.page); 
	price=req.body.data.price;
	category= req.body.data.category;
	brand=req.body.data.brand;
	size=req.body.data.size;
	max = parseInt(req.body.data.max); 
	
	if(price==undefined)
	{
		isPrice=false;
	}
	if(category==undefined)
	{
		isCate=false;
	}
	if(brand==undefined)
	{
		isBrand=false;
	}
	cur_page = page;
	page -= 1;
	per_page = max ? max : 20; 
	previous_btn = true;
	next_btn = true;
	first_btn = true;
	last_btn = true;
	start = page * per_page;
	
	console.log('Page:'+ page);
	console.log('Max:'+ max);
	console.log('Brand:'+ brand);
	console.log('Size:'+ size);
	console.log('Url:'+ req.originalUrl);
	
	var all_items = '';
	var count = '';
	
	
	async.parallel([
		function(callback) {
			
			
			if(isPrice && isCate && isBrand)
			{
				if(price==1)
				{
					Product.find( { price:{$gt:0,$lt:70},category: category, brand: brand},function(err, docs){
						if (err) throw err;
						// console.log(docs);
						var products = [];
						for(var i=0; i<docs.length;i++)
						{
							for(var j=0;j<docs[i].size.length;j++)
							{
								if(size == docs[i].size[j]){
									products.push(docs[i]);
									break;
								}
							}
						}
						var item = [];
						for (var i=start;i<products.length;i++){
							if (i > (start + per_page + 1)){
								break;
							}
							else{
								item.push(products[i]);
							}
						}
						all_items = item;
						count = item.length;
						callback();
				
					});
				}
				else
				{
					
					Product.find( { price:{$gt:70},category: category, brand: brand},function(err, docs){
						if (err) throw err;
						// console.log(docs);
						var products = [];
						for(var i=0; i<docs.length;i++)
						{
							for(var j=0;j<docs[i].size.length;j++)
							{
								if(size == docs[i].size[j]){
									products.push(docs[i]);
									break;
								}
							}
						}
						var item = [];
						for (var i=start;i<products.length;i++){
							if (i > (start + per_page + 1)){
								break;
							}
							else{
								item.push(products[i]);
							}
						}
						all_items = item;
						count = item.length;
						callback();
				
					});
				}
			}
			else
			{
				if(isPrice && isCate)
				{
					if(price==1)
					{
						Product.find( { price:{$gt:0,$lt:70},category: category},function(err, docs){
							if (err) throw err;
							// console.log(docs);
							var products = [];
						for(var i=0; i<docs.length;i++)
						{
							for(var j=0;j<docs[i].size.length;j++)
							{
								if(size == docs[i].size[j]){
									products.push(docs[i]);
									break;
								}
							}
						}
						var item = [];
						for (var i=start;i<products.length;i++){
							if (i > (start + per_page + 1)){
								break;
							}
							else{
								item.push(products[i]);
							}
						}
							all_items = item;
							count = item.length;
							callback();
					
						});
					}
					else
					{
						Product.find( { price:{$gt:70},category: category},function(err, docs){
							if (err) throw err;
							// console.log(docs);
							var products = [];
						for(var i=0; i<docs.length;i++)
						{
							for(var j=0;j<docs[i].size.length;j++)
							{
								if(size == docs[i].size[j]){
									products.push(docs[i]);
									break;
								}
							}
						}
						var item = [];
						for (var i=start;i<products.length;i++){
							if (i > (start + per_page + 1)){
								break;
							}
							else{
								item.push(products[i]);
							}
						}
							all_items = item;
							count = item.length;
							callback();
					
						});
					}
				}
				else
				{
					if(isPrice && isBrand)
					{
						if(price==1)
						{
							
							Product.find( { price:{$gt:0,$lt:70}, brand: brand},function(err, docs){
							if (err) throw err;
							// console.log(docs);
							var products = [];
							for(var i=0; i<docs.length;i++)
							{
								for(var j=0;j<docs[i].size.length;j++)
								{
									if(size == docs[i].size[j]){
										products.push(docs[i]);
										break;
									}
								}
							}
							var item = [];
							for (var i=start;i<products.length;i++){
								if (i > (start + per_page + 1)){
									break;
								}
								else{
									item.push(products[i]);
								}
							}
								all_items = item;
								count = item.length;
								callback();
						
							});
						}
						else
						{
							
							Product.find( { price:{$gt:70}, brand: brand},function(err, docs){
							if (err) throw err;
							// console.log(docs);
							var products = [];
							for(var i=0; i<docs.length;i++)
							{
								for(var j=0;j<docs[i].size.length;j++)
								{
									if(size == docs[i].size[j]){
										products.push(docs[i]);
										break;
									}
								}
							}
							var item = [];
							for (var i=start;i<products.length;i++){
								if (i > (start + per_page + 1)){
									break;
								}
								else{
									item.push(products[i]);
								}
							}
								all_items = item;
								count = item.length;
								callback();
								});
						}
					}
					else
					{
						if(isCate && isBrand)
						{
							
							Product.find( {category: category, brand: brand},function(err, docs){
							if (err) throw err;
							// console.log(docs);
							var products = [];
							for(var i=0; i<docs.length;i++)
							{
								for(var j=0;j<docs[i].size.length;j++)
								{
									if(size == docs[i].size[j]){
										products.push(docs[i]);
										break;
									}
								}
							}
							var item = [];
							for (var i=start;i<products.length;i++){
								if (i > (start + per_page + 1)){
									break;
								}
								else{
									item.push(products[i]);
								}
							}
								all_items = item;
								count = item.length;
								callback();
								});
						}
						else
						{
							if(isPrice)
							{
								if(price==1)
								{
									
									Product.find( { price:{$gt:0,$lt:70}},function(err, docs){
										if (err) throw err;
										// console.log(docs);
										var products = [];
										for(var i=0; i<docs.length;i++)
										{
											for(var j=0;j<docs[i].size.length;j++)
											{
												if(size == docs[i].size[j]){
													products.push(docs[i]);
													break;
												}
											}
										}
										var item = [];
										for (var i=start;i<products.length;i++){
											if (i > (start + per_page + 1)){
												break;
											}
											else{
												item.push(products[i]);
											}
										}
										all_items = item;
										count = item.length;
										callback();
									});
								}
								else
								{
									
									Product.find( { price:{$gt:70}},function(err, docs)
									{
										if (err) throw err;
										// console.log(docs);
										var products = [];
										for(var i=0; i<docs.length;i++)
										{
											for(var j=0;j<docs[i].size.length;j++)
											{
												if(size == docs[i].size[j]){
													products.push(docs[i]);
													break;
												}
											}
										}
										var item = [];
										for (var i=start;i<products.length;i++){
											if (i > (start + per_page + 1)){
												break;
											}
											else{
												item.push(products[i]);
											}
										}
										all_items = item;
										count = item.length;
										callback();
									});
									
								}
							}
							else
							{
								if(isCate)
								{
									
									Product.find( {category: category},function(err, docs){
									if (err) throw err;
									// console.log(docs);
									var products = [];
									for(var i=0; i<docs.length;i++)
									{
										for(var j=0;j<docs[i].size.length;j++)
										{
											if(size == docs[i].size[j]){
												products.push(docs[i]);
												break;
											}
										}
									}
									var item = [];
									for (var i=start;i<products.length;i++){
										if (i > (start + per_page + 1)){
											break;
										}
										else{
											item.push(products[i]);
										}
									}
									all_items = item;
									count = item.length;
									callback();
									});
								}
								else
								{
									if(isBrand)
									{
										Product.find( {brand: req.body.brand},function(err, docs){
										if (err) throw err;
										// console.log(docs);
										var products = [];
										for(var i=0; i<docs.length;i++)
										{
											for(var j=0;j<docs[i].size.length;j++)
											{
												if(size == docs[i].size[j]){
													products.push(docs[i]);
													break;
												}
											}
										}
										var item = [];
										for (var i=start;i<products.length;i++){
											if (i > (start + per_page + 1)){
												break;
											}
											else{
												item.push(products[i]);
											}
										}
										all_items = item;
										count = item.length;
										callback();
										});
									}
									else
									{
										Product.find(function(err, docs){
										if (err) throw err;
										// console.log(docs);
										var products = [];
										for(var i=0; i<docs.length;i++)
										{
											for(var j=0;j<docs[i].size.length;j++)
											{
												if(size == docs[i].size[j]){
													products.push(docs[i]);
													break;
												}
											}
										}
										var item = [];
										for (var i=start;i<products.length;i++){
											if (i > (start + per_page + 1)){
												break;
											}
											else{
												item.push(products[i]);
											}
										}
										all_items = item;
										count = item.length;
										callback();
										});
									}
								}
							}
						}
					}
				}
			}
			
	},
		function(callback) {
			
		}
	], function(err) { //This is the final callback
		console.log('count out:' +count);
		if( count ){
			console.log('count:' +count);
			console.log('all items ngoài for:' + all_items);
			var dem=0;
			var open=false;
			
			for (var key in all_items) {
				
				if(dem%3==0 && open==false && dem< max){
					pag_content +='<ul class="thumbnails">';
					pag_content +=  '<li class="span4">'+
									'<div class="thumbnail">'+
									'<a href="/viewproduct/detail/'+all_items[key].id + '" class="overlay"></a>'+
									'<a class="zoomTool" href="/viewproduct/detail/' + all_items[key].id + '" title="add to cart"><span class="icon-search"></span>VIEW DETAIL</a>'+
									  '<a href="/viewproduct/detail/'+all_items[key].id+'"><img src="'+all_items[key].imagePath[0]+'" alt="..." ></a>'+
									  '<div class="caption cntr">'+
										'<p class="productTitle">'+all_items[key].title+'</p>'+
										'<p style = "color:#f89406"><strong> $'+all_items[key].price+'</strong></p>'+
									  '</div>'+
									  '</div>'+
									  '</li>';
					open=true;
				}
				
				if(dem%3!=0)
				{
					pag_content +=  '<li class="span4">'+
									'<div class="thumbnail">'+
									'<a href="/viewproduct/detail/'+all_items[key].id + '" class="overlay"></a>'+
									'<a class="zoomTool" href="/viewproduct/detail/' + all_items[key].id + '" title="add to cart"><span class="icon-search"></span>VIEW DETAIL</a>'+
									  '<a href="/viewproduct/detail/'+all_items[key].id+'"><img src="'+all_items[key].imagePath[0]+'" alt="..." ></a>'+
									  '<div class="caption cntr">'+
										'<p class="productTitle">'+all_items[key].title+'</p>'+
										'<p style = "color:#f89406"><strong> $'+all_items[key].price+'</strong></p>'+
									  '</div></div></li>';
				}//if
				if (dem%3==2 && open==true){
					pag_content += '</ul>';
					open=false;
					
				}
				if (dem== max -1){
					break;
				}
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
	
	//////////////////////
	
};

exports.filter = function (req,res,next) {
	var btnAction = req.body.submitSearch;
	var userProfile = req.user;
	var productID = [];
	productID=req.session.productID || [];
	var items = 0;
	if (productID.length > 0)
		items = productID.length;
	if(btnAction=='Filter'){
	var isPrice=true;
	var isCate=true;
	var isBrand=true;
	var query;
	if(req.body.price==undefined)
	{
		isPrice=false;
	}
	if(req.body.category==undefined)
	{
		isCate=false;
	}
	if(req.body.brand==undefined)
	{
		isBrand=false;
	}
	
	if(isPrice && isCate && isBrand){
		if(req.body.price==1)
		{
			query = Product.find( { price:{$gt:0,$lt:70},category: req.body.category, brand: req.body.brand} );
		}
		else
		{
			query = Product.find( { price:{$gt:70},category: req.body.category, brand: req.body.brand} );
		}
	}
	else
	{
		if(isPrice && isCate)
		{
			if(req.body.price==1)
			{
				query = Product.find( { price:{$gt:0,$lt:70},category: req.body.category} );
			}
			else
			{
				query = Product.find( { price:{$gt:70},category: req.body.category} );
			}
		}
		else
		{
			if(isPrice && isBrand){
				if(req.body.price==1)
				{
					query = Product.find( { price:{$gt:0,$lt:70}, brand: req.body.brand} );
				}
				else
				{
					query = Product.find( { price:{$gt:70}, brand: req.body.brand} );
				}
			}
			else
			{
				if(isCate && isBrand)
				{
					query = Product.find( {category: req.body.category, brand: req.body.brand} );
				}
				else
				{
					if(isPrice)
					{
						if(req.body.price==1)
						{
							query = Product.find( { price:{$gt:0,$lt:70}} );
						}
						else
						{
							query = Product.find( { price:{$gt:70}} );
						}
					}
					else
					{
						if(isCate)
						{
							query = Product.find( {category: req.body.category} );
						}
						else
						{
							if(isBrand)
							{
								query = Product.find( {brand: req.body.brand} );
							}
							else
							{
								query = Product.find();
							}
						}
					}
				}
			}
		}
	}
	query.exec(function(err,docs){
		
		var products = [];
		for(var i=0; i<docs.length;i++)
		{
			for(var j=0;j<docs[i].size.length;j++)
			{
				if(req.body.size == docs[i].size[j]){
					products.push(docs[i]);
					break;
				}
			}
		}
		console.log('Product filter: ' + products);
		var productChunks = [];
		var chunkSize = 3;
		for (var i=0;i< products.length;i+= chunkSize){
			productChunks.push(products.slice(i,i+ chunkSize));
		}
		brandController.get_list_brands(function(err, brands) {
			console.log('Brands: ' + brands);
			categoryController.get_list_categories(function(err, categories) {
			console.log('Categories: ' + categories);
		res.render('UserView/index-search', {
				title: 'Shopping Mall',
				products: productChunks,
				userProfile: userProfile,
				brands: brands,
				categories: categories,
				items: items,
				layout: 'UserView/layout'
				});
				});
				});
			});
	}
	else{
		if(btnAction=='Search')
		{
			console.log('search name:' + req.body.productName);
			if(req.body.productName==undefined)
			{
				res.redirect('/');
			}
			else
			{Product.find(function(err,docs){
				var str=req.body.productName;
				console.log('Product name:' + req.body.productName);
				var products = [];
				if(str.indexOf(" ")!=-1)
				{
					var s = str.split(" ");
				
					for(var i=0; i<docs.length; i++)
					{
						for(var j=0; j<s.length;j++)
						{
							if(docs[i].title.indexOf(s[j]) != -1){
								products.push(docs[i]);
								break;
							}
						}
					}
				
				}
				else{
					for(var i=0; i<docs.length; i++)
					{
						if(docs[i].title.indexOf(str) != -1)
						{
							products.push(docs[i]);
						}
					}
				}
				
				
				console.log('Product search: ' + products);
				var productChunks = [];
				var chunkSize = 3;
				for (var i=0;i< products.length;i+= chunkSize){
					productChunks.push(products.slice(i,i+ chunkSize));
				}
				brandController.get_list_brands(function(err, brands) {
					console.log('Brands: ' + brands);
					categoryController.get_list_categories(function(err, categories) {
					console.log('Categories: ' + categories);
				res.render('UserView/index-search', {
						title: 'Shopping Mall',
						products: productChunks,
						userProfile: userProfile,
						brands: brands,
						categories: categories,
						items: items,
						layout: 'UserView/layout'
						});
						});
						});
					});
			}
		}
		else{
			res.redirect('/');
		}
	}
};

exports.search = function (req,res,next) {
	var userProfile = req.user;
	var productID = [];
	productID=req.session.productID || [];
	var items = 0;
	if (productID.length > 0)
		items = productID.length;
	console.log('search name:' + req.body.productName);
	if(req.body.productName==undefined)
	{
		res.redirect('/');
	}
	else
	{Product.find(function(err,docs){
		var str=req.body.productName;
		console.log('Product name:' + req.body.productName);
		var s = str.split(" ");
		
		var products = [];
		
		for(var i=0; i<s.length;i++)
		{
			for(var j=0; j<docs.length;j++)
			{
				if(docs[j].title.indexOf(s[i]) != -1){
					products.push(docs[j]);
				}
			}
		}
		
		console.log('Product search: ' + products);
		var productChunks = [];
		var chunkSize = 3;
		for (var i=0;i< products.length;i+= chunkSize){
			productChunks.push(products.slice(i,i+ chunkSize));
		}
		brandController.get_list_brands(function(err, brands) {
			console.log('Brands: ' + brands);
			categoryController.get_list_categories(function(err, categories) {
			console.log('Categories: ' + categories);
		res.render('UserView/index-search', {
				title: 'Shopping Mall',
				products: productChunks,
				userProfile: userProfile,
				brands: brands,
				categories: categories,
				items: items,
				layout: 'UserView/layout'
				});
				});
				});
			});
	}
};

var findProductsByIDs = function (listid,callback) {
	var result = [];
	for (var i=0;i<listid.length;i++){
		Product.findById(listid[i],function(err,product){
		 if (err) {
            //console.log('Product not found');
            //callback(err? err: 'Product not found');
        } else {
            //callback(null, products);
			result.push(product);
        }
		//return doc2;
	});
	}
	callback(null, result);
	
};

var UpdateAfterOder = function (id,qty,callback) {
	Product.findByIdAndUpdate(id,{ quantity: qty },function(err,docs){
		 if (err) {
            console.log('Category not found');
            callback(err? err: 'Category not found');
        } else {
            callback(null, docs);
        }
		//return doc2;
	});
};

module.exports.update_after_order = UpdateAfterOder;

module.exports.get_products_by_ids = findProductsByIDs;