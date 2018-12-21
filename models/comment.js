var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var CommentSchema = Schema(
    {
        productID: {type: String,  require: true},
		userID: {type: String,  require: true},
		content: {type: String,  require: true},
		time: {type: String,  require: true}
    }
);

//Export model
module.exports = mongoose.model('Comment', CommentSchema);