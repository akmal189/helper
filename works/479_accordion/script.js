$(function(){
	$('.accordion-block__item-title').on('click', function(){
		$(this).next().slideToggle()
	})
})