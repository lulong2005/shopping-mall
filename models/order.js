var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var OrderSchema = Schema(
    {
        productID: {type: [],  require: true},
		order_code: {type: String, require: true},
		userID: {type: String,  require: true},
		size: {type: [],  require: true},
		quantity: {type: [],  require: true},
		time: {type: String,  require: true},
		phone: {type: String,  require: true},
		address: {type: String,  require: true},
		status: {type: String, require: true}


    }
);

//Export model
module.exports = mongoose.model('Order', OrderSchema);