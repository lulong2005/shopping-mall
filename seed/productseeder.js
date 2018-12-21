var Product = require('../models/product');
var mongoose = require('mongoose');
mongoose.connect('localhost:27017/productapp');
var products = [ 
	new Product({
	imagePath: 'http://www.uksoccershop.com/images/germany-2014-2015-adidas-4-star-home-winners-football-kit.jpg',
	title: '2014-2015 Germany Home 4 Star Winners Football Shirt',
	description: 'Official 2014-15 Germany Home 4 Star Winners Shirt available to buy online. This is the new football shirt of the German National Team which will be worn in the 2014 World Cup Finals. The new Germany football kit is manufactured by Adidas and is available to buy in adult sizes S, M, L, XL, XXL, XXXL.',
	price: 83.75
	}),
	new Product({
	imagePath: 'http://www.uksoccershop.com/images/germany-2016-2017-adidas-authentic-away-football-kit.jpg',
	title: '2016-2017 Germany Authentic Away Adidas Football Shirt',
	description: 'Official 2016 2017 Germany Authentic Away Shirt available to buy online. This is the new football shirt of the German National Team for Euro 2016. The new Germany football kit is manufactured by Adidas and is available to buy in adult sizes S, M, L, XL, XXL, XXXL. ',
	price: 64.42
	}),
	new Product({
	imagePath: 'http://www.soccerlord.se/wp-content/uploads/2016/03/Bayern-Munich-Home-Football-Shirt-16-17.jpg',
	title: 'BAYERN MUNICH HOME FOOTBALL SHIRT 16/17',
	description: 'This is the Bayern Munich Home Football Shirt 2016 2017. The new Bayern Munich home jersey is a modern update on a classic look. The Bundesliga champions will wear a shirt inspired by designs from the past and returns the simple, stylish red and white. A two-button polo color is lined with white.',
	price: 19.00
	}),
	new Product({
	imagePath: 'https://s-media-cache-ak0.pinimg.com/736x/68/a7/2d/68a72d6f05aa94701ade06f6689e3b13.jpg',
	title: '2014-15 Bayern Munich Home Shirt',
	description: 'Official Robert Lewandowski football shirt for the Bayern Munich football team. This is the new Bayern home shirt for the 2014-15 Bundesliga season which is manufactured by Adidas and is available in adult sizes S, M, L, XL, XXL, XXXL and kids sizes small boys, medium boys, large boys, XL boys.',
	price: 77.32
	}),
	new Product({
	imagePath: 'https://www.intersport.co.uk/images/adidas-mens-fc-bayern-munich-away-football-shirt-p2078-5302_image.jpg',
	title: 'Mens FC Bayern Munich Away Football Shirt',
	description: 'Pay tribute to der FCB in this mens soccer jersey modelled after the teams away kit. Its climacool design features mesh inserts for targeted ventilation. It includes a team badge on the chest and "Bayern München" printed across the back.',
	price: 29.99
	}),
	new Product({
	imagePath: 'https://cdn.shopify.com/s/files/1/1099/7606/products/73013_1024x1024.jpg?v=1459915370',
	title: '2016-2017 GERMANY HOME SHIRT (MULLER 13)',
	description: 'Official 2016 2017 Germany Home Shirt available to buy online. This is the new football shirt of the German National Team for Euro 2016. The new Germany football kit is manufactured by Adidas and is available to buy in adult sizes S, M, L, XL',
	price: 77.99
	})
];
var done=0;
for (var i=0;i<products.length;i++){
	products[i].save(function(err,result){
		done++;
		if (done == products.length){
			exit();
		}
	});
}
function exit(){
	mongoose.disconnect();
}
module.exports = products;