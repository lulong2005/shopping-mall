var Category = require('../models/category');
var mongoose = require('mongoose');
mongoose.connect('mongodb://admin:admin@ds135552.mlab.com:35552/shopping-mall');
var categories = [ 
	new Category({
	name: 'Shirt'
	}),
	new Category({
	name: 'Jacket'
	}),
	new Category({
	iname: 'Trouser'
	})
];
var done=0;
for (var i=0;i<categories.length;i++){
	categories[i].save(function(err,result){
		done++;
		if (done == categories.length){
			exit();
		}
	});
}
function exit(){
	mongoose.disconnect();
}
module.exports = categories;