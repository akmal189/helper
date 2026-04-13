$(function() {
	$('.tm_faq_btn').click(function() {
		$('.form-wrapper').addClass('opened');
		return false;
	});
	$('.form-wrapper .icon-close').click(function() {
		$('.form-wrapper').removeClass('opened');
		return false;
	});
	$(document).click( function(event){
	    if( $(event.target).closest('.form-wrapper-inner, #tcal, .plupload').length ) 
	      return;
	    $('.form-wrapper').removeClass('opened');
	    event.stopPropagation();
	})
    $(document).keydown(function(event){
        if (event.which == 27) {
            $('.form-wrapper').removeClass('opened');
        }
    });
});