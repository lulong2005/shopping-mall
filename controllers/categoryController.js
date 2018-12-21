var Category = require ('../models/category');

var findCategories = function (callback) {
	Category.find(function(err,categories){
		 if (err) {
            console.log('Category not found');
            callback(err? err: 'Category not found');
        } else {
            callback(null, categories);
        }
		//return doc2;
	});
};
var findCategoryID = function (id,callback) {
	Category.findById(id,function(err,categories){
		 if (err) {
            console.log('Category not found');
            callback(err? err: 'Category not found');
        } else {
            callback(null, categories);
        }
		//return doc2;
	});
};

exports.add_new_category_get = function (req,res,next) {

    var userProfile = req.user;
    res.render('AdminView/addcategory', {
        title: 'Admin Shop Mall',
        userProfile: userProfile,
        layout: 'AdminView/layout'
    });
};

exports.add_new_category_post = function (req,res,next) {
    name = req.body.name;
    var userProfile = req.user;
    Category.findOne({'name': name}).exec(function (req,category) {
        if (category)
        {
            res.render('AdminView/addcategory', {
                title: 'Admin Shop Mall',
                userProfile: userProfile,
                message: 'Category is exists',
                hasErrors: true,
                layout: 'AdminView/layout'
            });
        }
        else{
            var category = new Category({
                name: name
            });
            category.save(function (err) {
                console.log(err);
            });
            res.render('AdminView/addcategory', {
                title: 'Admin Shop Mall',
                userProfile: userProfile,
                success: 'Category create successfully',
                layout: 'AdminView/layout'
            });
        }
    });
};
module.exports.get_list_categories = findCategories;
module.exports.get_category_by_id = findCategoryID;