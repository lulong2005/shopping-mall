exports.pagination = function(){
	  // Thuộc tính
     this.config = {
		'current_page': 1, // Trang hiện tại
        'total_record': 1, // Tổng số record
        'total_page': 1, // Tổng số trang
        'limit': 10,// limit
        'start': 0, // start
        'link_full': '',// Link full có dạng như sau: domain/com/page/{page}
        'link_first': '',// Link trang đầu tiên
        'range': 9, // Số button trang bạn muốn hiển thị 
        'min': 0, // Tham số min
        'max': 0  // tham số max, min và max là 2 tham số private
	};
	
	this.get_config = function (key){
		
        return this.config[key];
    };
     
    /*
     * Hàm khởi tạo ban đầu để sử dụng phân trang
     */
    this.init = function (config)//mảng
    {
        /*
         * Lặp qua từng phần tử config truyền vào và gán vào config của đối tượng
         * trước khi gán vào thì phải kiểm tra thông số config truyền vào có nằm
         * trong hệ thống config không, nếu có thì mới gán
         */
		 this.config.current_page = config.current_page;
		 this.config.total_record = config.total_record;
		 this.config.total_page = config.total_page;
		 this.config.limit = config.limit;
		 this.config.start = config.start;
		 this.config.link_full = config.link_full;
		 this.config.link_first = config.link_first;
		 this.config.range = config.range;
		 this.config.min = config.min;
		 this.config.max = config.max;
       
         
        /*
         * Kiểm tra thông số limit truyền vào có nhỏ hơn 0 hay không?
         * Nếu nhỏ hơn thì gán cho limit = 0, vì trong mysql không cho limit bé hơn 0
         */
        if (this.config.limit < 0){
            this.config.limit = 0;
        }
         
        /*
         * Tính total page, công tức tính tổng số trang như sau: 
         * total_page = ciel(total_record/limit).
         * Tại sao lại như vậy? Đây là công thức tính trung bình thôi, ví
         * dụ tôi có 1000 record và tôi muốn mỗi trang là 100 record thì 
         * đương nhiên sẽ lấy 1000/100 = 10 trang đúng không nào :D
         */
		 if (this.config.total_record % this.config.limit == 0){
			this.config.total_page = this.config.total_record / this.config.limit;
		 }
		 else{
			 this.config.total_page = this.config.total_record / this.config.limit + 1;
		 }
         
        /*
         * Sau khi có tổng số trang ta kiểm tra xem nó có nhỏ hơn 0 hay không
         * nếu nhỏ hơn 0 thì gán nó băng 1 ngay. Vì mặc định tổng số trang luôn bằng 1
         */
        if (this.config.total_page==0){
            this.config.total_page = 1;
        }
         
        /*
         * Trang hiện tại sẽ rơi vào một trong các trường hợp sau:
         *  - Nếu người dùng truyền vào số trang nhỏ hơn 1 thì ta sẽ gán nó = 1 
         *  - Nếu trang hiện tại người dùng truyền vào lớn hơn tổng số trang
         *    thì ta gán nó bằng tổng số trang
         * Đây là vấn đề giúp web chạy trơn tru hơn, vì đôi khi người dùng cố ý
         * thay đổi tham số trên url nhằm kiểm tra lỗi web của chúng ta
         */
        if (this.config.current_page < 1){
            this.config.current_page = 1;
        }
         
        if (this.config.current_page > this.config.total_page){
            this.config.current_page = this.config.total_page;
        }
         
        /* 
         * Tính start, Như bạn biết trong mysql truy vấn sẽ có limit và start
         * Muốn tính start ta phải dựa vào số trang hiện tại và số limit trên mỗi trang
         * và áp dụng công tức start = (current_page - 1)*limit
        */
        this.config.start = (this.config.current_page - 1) * this.config.limit;
         
        /* 
         * Bây giờ ta tính số trang ta show ra trang web
         * Như bạn biết với những website có data lớn thì số trang có thể
         * lên tới hàng trăm trang, chẵng nhẽ ta show hết cả 100 trang?
         * Nên trong bài này tôi hướng dẫn bạn show trong một khoảng nào đó (range)
         * giống website freetuts.net vậy
        */
         
        // Trước tiên tính middle, đây chính là số nằm giữa trong khoảng tổng số trang
        // mà bạn muốn hiển thị ra màn hình
		var middle = this.config.range / 2;
		if(this.config.range % 2 > 0)
			middle = this.config.range / 2 + 1;
 
        // Ta sẽ lâm vào các trường hợp như bên dưới
        // Trong trường hợp này thì nếu tổng số trang mà bé hơn range
        // thì ta show hết luôn, không cần tính toán làm gì
        // tức là gán min = 1 và max = tổng số trang luôn
        if (this.config.total_page < this.config.range){
            this.config.min = 1;
            this.config.max = this.config.total_page;
        }
        // Trường hợp tổng số trang mà lớn hơn range
        else
        {
            // Ta sẽ gán min = current_page - (middle + 1)
            this.config.min = this.config.current_page - middle + 1;
             
            // Ta sẽ gán max = current_page + (middle - 1)
            this.config.max = this.config.current_page + middle - 1;
             
            // Sau khi tính min và max ta sẽ kiểm tra
            // nếu min < 1 thì ta sẽ gán min = 1  và max bằng luôn range
            if (this.config.min < 1){
                this.config.min = 1;
                this.config.max = this.config.range;
            }
             
            // Ngược lại nếu min > tổng số trang
            // ta gán max = tổng số trang và min = (tổng số trang - range) + 1 
            else if (this.config.max > this.config.total_page) 
            {
                this.config.max = this.config.total_page;
                this.config.min = this.config.total_page - this.config.range + 1;
            }
        }
    };
     
    /*
     * Hàm lấy link theo trang
     */
    this.__link=function (page)
    {
        // Nếu trang < 1 thì ta sẽ lấy link first
        if (page <= 1 && this.config.link_first){
            return this.config.link_first;
        }
        // Ngược lại ta lấy link_full
        // Như tôi comment ở trên, link full có dạng domain.com/page/{page}.
        // Trong đó {page} là nơi bạn muốn số trang sẽ thay thế vào
        return this.config.link_full.replace("{page}", page);
    };
     
    /*
     * Hàm lấy mã html
     * Hàm này ban tạo giống theo giao diện của bạn
     * tôi không có config nhiều vì rất rối
     * Bạn thay đổi theo giao diện của bạn nhé
     */
    this.html = function()
    {   
        var p = '';
        if (this.config.total_record > this.config.limit)
        {
            p = '<ul>';
             
            // Nút prev và first
            if (this.config.current_page > 1)
            {
                p += '<li><a href="'+this.__link('1')+'">First</a></li>';
                p += '<li><a href="'+this.__link(this.config.current_page-1)+'">Prev</a></li>';
            }
             
            // lặp trong khoảng cách giữa min và max để hiển thị các nút
            for (var i = this.config.min; i <= this.config.max; i++)
            {
                // Trang hiện tại
                if (this.config.current_page == i){
                    p += '<li><span>' + i +'</span></li>';
                }
                else{
                    p += '<li><a href="'+this.__link(i)+'">'+i+'</a></li>';
                }
            }
 
            // Nút last và next
            if (this.config.current_page < this.config.total_page)
            {
                p += '<li><a href="'+this.__link(this.config.current_page + 1)+'">Next</a></li>';
                p += '<li><a href="'+this.__link(this.config.total_page)+'">Last</a></li>';
            }
             
            p += '</ul>';
        }
        return p;
    };
	return this;
};
 
// Bổ sung phương thức
