;(function($) {
	'use strict';
	
	$(function(){
		
		
		if($('.slider-list').length) {
			$('.slider-list').on('init', function(slick){
				$('.slider-list').lightGallery({
	                selector: '.slider-list .slick-slide:not(.slick-cloned) a',
	                thumbnail: false,
	                download: false
	            });
			});
			
			$('.slider-list').on('breakpoint', function(event, slick, breakpoint){
				$this.lightGallery({
	                selector: '.slider-list .slick-slide:not(.slick-cloned) a',
	                thumbnail: false,
	                download: false
	            });
			});
			
			$('.slider-list').slick({
				infinite: true,
				slidesToShow: 1,
				slidesToScroll: 1,
				arrows: true,
				autoplay: false,
				autoplaySpeed: 3000,
				pauseOnHover: false,
				dots: false
			});
		}
		
	});
	
})(jQuery);