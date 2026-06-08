$(function(){
    
    (function(){
        
        var examples2Prefix = 'examples2',
            $sliderWrapper = $('.js-' + examples2Prefix);
            
        $('.js-' + examples2Prefix).lightGallery({
            thumbnail: false,
            download: false,
            loop: false,
            selector: '.js-' + examples2Prefix + '-pic a'
        });
        
        $('.js-' + examples2Prefix + '-slider').slick({
            slidesToShow: 3,
            slidesToScroll: 1,
            autoplay: Boolean($sliderWrapper.data('autoplay')),
            autoplaySpeed: $sliderWrapper.data('autoplayspeed'),
            arrows: Boolean($sliderWrapper.data('arrows')),
            dots: Boolean($sliderWrapper.data('dots')),
            pauseOnFocus: false,
            pauseOnHover: false,
            appendDots: $sliderWrapper,
            infinite: true,
            responsive: [
                {
                  breakpoint: 960,
                  settings: {
                    slidesToShow: 2
                  }
                },
                {
                  breakpoint: 640,
                  settings: {
                      centerMode: true,
                    slidesToShow: 1
                  }
                },
                {
                  breakpoint: 479,
                  settings: {
                      centerMode: false,
                    slidesToShow: 1
                  }
                }
            ]
        });
        
    })();
    
});