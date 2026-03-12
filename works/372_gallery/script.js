$(function(){
	
	(function(){
		
		if($('.js-gallery2').length) {
			var gallery2Prefix = 'gallery2',
				$win = $(window);
				
			$('.js-' + gallery2Prefix).lightGallery({
				thumbnail: false,
				download: false,
				loop: false,
				selector: '.js-' + gallery2Prefix + '-pic a'
			});
		}
		
	})();
	
});