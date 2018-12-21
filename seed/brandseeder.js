var Brand = require('../models/brand');
var mongoose = require('mongoose');
mongoose.connect('mongodb://admin:admin@ds135552.mlab.com:35552/shopping-mall');
var brands = [ 
	new Brand({
	name: 'Adidas'
	}),
	new Brand({
	name: 'Nike'
	}),
	new Brand({
	iname: 'Puma'
	})
];
var done=0;
for (var i=0;i<brands.length;i++){
	brands[i].save(function(err,result){
		done++;
		if (done == brands.length){
			exit();
		}
	});
}
function exit(){
	mongoose.disconnect();
}
module.exports = brands;