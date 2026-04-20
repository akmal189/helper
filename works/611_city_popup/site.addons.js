;(function($) {
	'use strict';
	
	$(function(){
		
		$('.block-pop-wrap').appendTo('body');
	
		$('.city-in .title-city').click(function() {
		    $('.block-pop-wrap').addClass('opened');
		    $('.block-city-first-load').hide();
		    $('.city-not-found').hide();
		})
		$('.item-city').click(function() {
		    var thisCity = $(this).text(),
		    	city = $('.title-city span').text();
		    // $.cookie('city_select', thisCity);
		    localStorage.setItem('city_select', thisCity);
		    
		    if(thisCity == city) {
		    	// $.cookie('city_select', thisCity);
		    	localStorage.setItem('city_select', thisCity);
		    } else {
				document.location.href = $(this).data('link');
		    }
		
		    $('.block-pop-close').click();
		    return false;
		});
		
		$('.block-pop-close').on('click', function(){
			$('.block-pop-wrap').removeClass('opened');
		});
		$('.block-pop-close2').on('click', function(){
			var city_name = $('.site-city').data('title');
			$('.city-not-found').hide();
			// $.cookie('city_select', city_name);
			localStorage.setItem('city_select', city_name);
		});
		
		
		if (localStorage.getItem('city_select')) {
		    // let city = $.cookie('city_select');
		    let city = localStorage.getItem('city_select');
		} else {
		    let region_name = $('.block-city-first-load').data('region'),
		        finded = false;
		
		    let city_name = $('.block-city-first-load').data('city');
		    let city_name2 = $('.site-city').data('title');
		
		    $('.block-city-first-load').show();
		    
		    $('.city-yes').on('click', function() {
		
		        for (var i = 0; i < $('.item-city').length; i++) {
		            if ($('.item-city').eq(i).text() == city_name) {
		                $('.item-city').eq(i).trigger('click');
		                // $.cookie('city_select', city_name);
		                localStorage.setItem('city_select', city_name);
		                finded = true;
		                console.log(1)
		                break;
		            } else if ($('.item-city').eq(i).data('region') && region_name == $('.item-city').eq(i).data('region')) {
		                $('.item-city').eq(i).trigger('click');
		                // $.cookie('city_select', $('.item-city').eq(i).text());
		                localStorage.setItem('city_select', $('.item-city').eq(i).text());
		                finded = true;
		                break;
		            }
		        }
		
		        if (!finded) {
		            $('.city-not-found').show();
		            // $.cookie('city_select', city_name2);
		            localStorage.setItem('city_select', city_name2);
		        }
		
		        $('.block-city-first-load').hide();
		    })
		    $('.city-no').click(function() {
		        $('.block-pop-wrap').addClass('opened');
		    	$('.block-city-first-load').hide();
		    	$('.city-not-found').hide();
		    })
		}
		
		$(document).click(function(event) {
			if ($(event.target).closest(".title-city").length || $(event.target).closest(".block-form-product-pop2").length || $(event.target).closest(".city-no").length) return;
			$('.block-pop-wrap').removeClass('opened');
		});
        
        $('html').on('keyup', function(event) {
	        if (event.keyCode == 27) {
	            $('.block-pop-wrap').removeClass('opened');
	        }
	    });
		
	});
	
})(jQuery);