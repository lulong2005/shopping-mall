var Order = require('../models/order');
var mongoose = require('mongoose');
mongoose.connect('mongodb://admin:admin@ds135552.mlab.com:35552/shopping-mall');
var orders = [ 
	new Order({
	productID: ['5944a73f83269902d02f0714','5944a748a35f730f8c638565'],
	userID: '5950b3b36d8fb83a4411180f',
	size: [36,38],
	quantity: [2,1],
	time: '27/6/2017 10:13:36',
	phone: '12345678910',
	address: '227 Nguyễn Văn Cừ, quận 5, TPHCM'
	
	}),
	new Order({
	productID: ['5944a73f83269902d02f0714','5944a748a35f730f8c638567'],
	userID: '5950b3b36d8fb83a4411180f',
	size: [39,38],
	quantity: [1,3],
	time: '27/6/2017 10:13:36',
	phone: '12345678910',
	address: '227 Nguyễn Văn Cừ, quận 5, TPHCM'
	
	})
];
var done=0;
for (var i=0;i<orders.length;i++){
	orders[i].save(function(err,result){
		done++;
		if (done == orders.length){
			exit();
		}
	});
}
function exit(){
	mongoose.disconnect();
}
module.exports = orders;