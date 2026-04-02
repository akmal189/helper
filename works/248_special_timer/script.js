function saleTimer() {
    var $timer = $('.timer'),
        now = Date.now(),
        end = parseInt($timer.data('end-date')),
        end_date = new Date(),
        timer_end = readCookie('timer_end'),
        timer_end_date = readCookie('timer_end_date');

    timer_end = timer_end ? parseInt(timer_end) : end;

    if (timer_end_date && timer_end == end) {
        end = parseInt(timer_end_date);
        console.log('ok')
    } else {
        createCookie('timer_end', end, 1);
        end += now;
        createCookie('timer_end_date', end, 1);
        console.log(timer_end)
        if (timer_end<=0){
        	$('.title-text-time, .timer').hide();
        	$('.text-after').show();
        }
    }

    end_date.setTime(end);

    $timer.timer({
        endDate: end_date,
        locale: {
            days: ['день', 'дней', 'дней'],
            hours: 'час.',
            minuts: 'мин.',
            seconds: 'сек.'
        }
    });
}
;(function($) {
	
	'use strict';
	$(function(){
		if($('.sample-popup').length) {
			saleTimer();
			if (!sessionStorage.getItem('show')) {
				setTimeout(function(){
					$('.sample-popup').addClass('opened');
					$('html').addClass('overflow');
					sessionStorage.setItem('show', 1);
				}, 100);
			}
			
			$('.sample-close').bind('click', function(){
				$('.sample-popup').removeClass('opened');
	            $('html').removeClass('overflow');
			});
			
			$('.sample-close2').bind('click', function(){
				$('.sample-popup').removeClass('opened');
	            $('html').removeClass('overflow');
			});
			
			$(document).on('click', function(e){
			    if( $(e.target).closest('.sample-popup-in').length)
			    return
			
			    $('.sample-popup').removeClass('opened');
	            $('html').removeClass('overflow');
			});
		}
		
	})
})(jQuery);