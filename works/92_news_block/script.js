$(function(){
	const newsLength = $('.main-news__titles-item').length;
	$('.main-news__images').slick({
		dots: false,
		arrows: false,
		infinite: true,
		speed: 800,				
		autoplay: false,
		autoplaySpeed: 4000,
		draggable: true,
		fade: true,
		slidesToShow: 1
	})
	
	setInterval(() => {
		if($('.main-news__titles-item.active').index() + 1 == newsLength) {
			$('.main-news__titles-item').removeClass('active')
			$('.main-news__titles-item').first().trigger('click')
		} else {
			$('.main-news__titles-item.active').next().trigger('click')
		}
	}, 4000)
	
	
	$('.main-news__titles-item').on('click', function(){
		$('.main-news__titles-item').removeClass('active')
		$(this).addClass('active')
		$('.main-news__images').slick('slickGoTo', $(this).index());
	})
})