var Comment = require ('../models/comment');

var findCommentByProductID = function(productID, callback){
	Comment.find({productID: productID}, function(err, comments){
		if(err){
			callback(err? err: 'Comment not found');
		}
		else{
			callback(null, comments);
		}
	});
};

module.exports.get_comment_by_productid = findCommentByProductID;