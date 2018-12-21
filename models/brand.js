var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var BrandSchema = Schema(
    {
        name: {type: String,  require: true}
    }
);

//Export model
module.exports = mongoose.model('Brand', BrandSchema);