var app_remove = {
    
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
                _this.ajax_get_all_items_pagination(data.page, data.index);
            } else {
                /* Load first page */
                _this.ajax_get_all_items_pagination(1, $('.index').val());
            }
                    
            /* Search */
            $('body').on('click', '.post_search_submit', function(){
                _this.ajax_get_all_items_pagination(1, $('.index').val());
            });
           
            /* Pagination Clicks   */                  
            $('body').on('click', '.pagination-nav li.active', function(){
                var page = $(this).attr('p');
                _this.ajax_get_all_items_pagination(page, $('.index').val());                
            });
        }
        
        /**
         * AJAX front-end items pagination.
         */
        this.ajax_get_all_items_pagination = function(page, index){
            
            if($(".pagination-container-orderlist").length > 0 && $('.order-view-all').length > 0 ){
               // $(".pagination-container-orderlist").html('<img src="images/loading.gif" class="ml-tb" />');
                
                var post_data = {
                    page: page,
                    index: index,
                    max: 2,
                };
                
                $('form.post-list input').val(JSON.stringify(post_data));
                
                var data = {
                    action: 'get-all-order',
                    data: JSON.parse($('form.post-list input').val())
                };
                
                $.ajax({
                    url: 'order/orderlist',
                    type: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify(data),
                    success: function (response) {
                        
                        if($(".pagination-container-orderlist").html(response.content)){
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
    posts = new app_remove.Posts(); /* Instantiate the Posts Class */
    posts.init(); /* Load Posts class methods */    
});