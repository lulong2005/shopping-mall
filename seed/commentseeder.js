var Comment = require('../models/comment');
var mongoose = require('mongoose');
mongoose.connect('mongodb://admin:admin@ds135552.mlab.com:35552/shopping-mall');
var comments = [ 
	new Comment({
	productID: '5944a73f83269902d02f0714',
	userID: '594b7572a52d012d58aecc07',
	content: 'Good! Look beautiful',
	time: '27/6/2017 10:13:36'
	}),
	new Comment({
	productID: '5944a73f83269902d02f0714',
	userID: '5950b3b36d8fb83a4411180f',
	content: 'Bad and expensive',
	time: '28/6/2017 10:13:36'
	})
];
var done=0;
for (var i=0;i<comments.length;i++){
	comments[i].save(function(err,result){
		done++;
		if (done == comments.length){
			exit();
		}
	});
}
function exit(){
	mongoose.disconnect();
}
module.exports = comments;