$(function () {
    let wrapper = $('.callback_wrapper');

    wrapper.on('click', '.callback_title', function () {
        let $this = $(this),
            form = $('.callback_wrapper .callback');
            
        $.ajax({
		    url: $(this).data('api-url'),
		    dataType: 'json',
		    success: function(response) {
		        if (!response.result.error) {
		            
		            $('.callback_wrapper .tpl-anketa').remove();
		            $(response.result.html).appendTo(form);
		            
		
		            s3From.initForms(form);
		        }
		    }
		});    

        function initForm() {
            form.animate({width: "toggle"}, 300);
        }

        initForm();

        return false;
    });
});