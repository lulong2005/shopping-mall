var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ProductSchema = Schema(
    {
        imagePath: {type: [], require: true},
        title: {type: String,  require: true},
        description: {type: String,  require: true},
        price: {type: Number,  require: true},
		size: {type: [], require: true},
		quantity: {type: [], require: true},
		category: {type: String,  require: true},
		brand: {type: String,  require: true},
		view: {type: Number, require: true}
    }
);

//Export model
module.exports = mongoose.model('Product', ProductSchema);