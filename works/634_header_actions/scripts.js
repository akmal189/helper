;(function($) {
	'use strict';
	
	$(function(){
		
		if($('.header-info-container').length) {
		
			var containerClosedDate = localStorage.getItem('headerInfoClosed');
	
		    if (containerClosedDate) {
		        var currentDateTime = new Date();
		        currentDateTime.setHours(0,0,0,0);
		
		        var containerClosedDateTime = new Date(containerClosedDate);
		
		        if (currentDateTime > containerClosedDateTime) {
		            $('.header-info-container').removeClass('hidden');
		        } else {
		            $('.header-info-container').addClass('hidden');
		        }
		    } else {
		    	//$('.header-info-container').removeClass('hidden');
		    }
		
		    $('.header-info-close').click(function(){
		        $('.header-info-container').addClass('hidden');
		        var now = new Date();
		        localStorage.setItem('headerInfoClosed', now);
		        console.log(11)
		    });
		}
		
	});
	
})(jQuery);