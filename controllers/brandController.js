var Brand = require ('../models/brand');

var findBrands = function (callback) {
	Brand.find(function(err,brands){
		 if (err) {
            console.log('Brand not found');
            callback(err? err: 'Brand not found');
        } else {
            callback(null, brands);
        }
		//return doc2;
	});
};
var findBrandID = function (id,callback) {
	Brand.findById(id,function(err,brands){
		 if (err) {
            console.log('Category not found');
            callback(err? err: 'Category not found');
        } else {
            callback(null, brands);
        }
		//return doc2;
	});
};

exports.add_new_brand_get = function (req,res,next) {

    var userProfile = req.user;
    res.render('AdminView/addbrand', {
        title: 'Admin Shop Mall',
        userProfile: userProfile,
        layout: 'AdminView/layout'
    });


}

exports.add_new_brand_post =function (req, res, next) {

    var userProfile = req.user;
    var name = req.body.name;
    Brand.findOne({'name': name}).exec(function (err,brand) {
        if (brand)
        {
            res.render('AdminView/addbrand', {
                title: 'Admin Shop Mall',
                message: 'Brand is exists',
                hasErrors: true,
                userProfile: userProfile,
                layout: 'AdminView/layout'
            });
        }
        else
        {
            var brand_instance = new Brand({
               name: name
            });
            brand_instance.save(function (err) {
               if (err)
               {
                   console.log(err);
               }
            });
            res.render('AdminView/addbrand', {
                title: 'Admin Shop Mall',
                success: 'Brand create successfully',
                userProfile: userProfile,
                layout: 'AdminView/layout'
            });
        }

    });
}
module.exports.get_brand_by_id = findBrandID;
module.exports.get_list_brands = findBrands;