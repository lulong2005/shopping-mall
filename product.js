var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ProductSchema = Schema(
    {
        imagePath: {type: String, require: true},
        title: {type: String,  require: true},
        description: {type: String,  require: true},
        price: {type: Number,  require: true}
    }
);

//Export model
module.exports = mongoose.model('Product', ProductSchema);