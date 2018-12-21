var app = {
    
    Posts: function() {
        
        /**
         * This method contains the list of functions that needs to be loaded
         * when the "Posts" object is instantiated.
         *
         */
        this.init = function() {
            this.get_all_items_pagination();
        }
        
        /**
         * Load front-end items pagination.
         */
        this.get_all_items_pagination = function() {
            
            _this = this;
            
            /* Check if our hidden form input is not empty, meaning it's not the first time viewing the page. */
            if($('form.post-list input').val()){
                /* Submit hidden form input value to load previous page number */
                data = JSON.parse($('form.post-list input').val());
                _this.ajax_get_all_items_pagination(data.page);
            } else {
                /* Load first page */
                _this.ajax_get_all_items_pagination(1);
            }
                    
            /* Search */
            $('body').on('click', '.filter-products', function(){
                _this.ajax_get_items_filter_pagination(1, $('.price').val(), $('.category').val(), $('.brand').val(), $('.size').val());
            });
            /* Search when Enter Key is triggered */
            /*$(".post_search_text").keyup(function (e) {
                if (e.keyCode == 13) {
                    _this.ajax_get_all_items_pagination(1, $('.post_name').val(), $('.post_sort').val());
                }
            });*/
            
            /* Pagination Clicks   */                  
            $('body').on('click', '.pagination-nav li.active', function(){
                var page = $(this).attr('p');
                _this.ajax_get_all_items_pagination(page);                
            });
        }
        
        /**
         * AJAX front-end items pagination.
         */
        this.ajax_get_all_items_pagination = function(page){
            
            if($(".pagination-container").length > 0 && $('.products-view-all').length > 0 ){
                //$(".pagination-container").html('<img src="images/loading.gif" class="ml-tb" />');
                
                var post_data = {
                    page: page,
                    max: 6,
                };
                
                $('form.post-list input').val(JSON.stringify(post_data));
                
                var data = {
                    action: 'get-all-products',
                    data: JSON.parse($('form.post-list input').val())//chuyển JSON sang Object
                };
                
                $.ajax({
                    url: '',
                    type: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify(data),//chuyển object sang JSON
                    success: function (response) {
                        
                        if($(".pagination-container").html(response.content)){
                            $('.pagination-nav').html(response.navigation);
                        }
                    }
                });
            }
        }
		
		this.ajax_get_items_filter_pagination=function(page, price, category, brand, size){
			console.log('Size:'+ size);
			if($(".pagination-container").length > 0 && $('.products-view-all').length > 0 ){
                //$(".pagination-container").html('<img src="images/loading.gif" class="ml-tb" />');
                
                var post_data = {
                    page: page,
					price: price,
					category: category,
					brand:brand,
					size:size,
                    max: 6,
                };
                
                $('form.post-list input').val(JSON.stringify(post_data));
                
                var data = {
                    action: 'get-all-products',
                    data: JSON.parse($('form.post-list input').val())//chuyển JSON sang Object
                };
                
                $.ajax({
                    url: 'viewproduct/filter',
                    type: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify(data),//chuyển object sang JSON
                    success: function (response) {
                        
                        if($(".pagination-container").html(response.content)){
                            $('.pagination-nav').html(response.navigation);
                        }
                    }
                });
            }
		}
    }
}

/**
 * When the document has been loaded...
 *
 */
jQuery(document).ready( function () {
    posts = new app.Posts(); /* Instantiate the Posts Class */
    posts.init(); /* Load Posts class methods */    
});