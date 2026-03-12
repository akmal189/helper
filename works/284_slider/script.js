$(function(){
    
    (function(){
        
        var galleryWithPreviewPrefix = 'gallery-with-preview';
        
        $('.js-' + galleryWithPreviewPrefix).lightGallery({
            thumbnail: false,
            download: false,
            loop: false,
            selector: '.js-' + galleryWithPreviewPrefix + '-img a'
        });
        
        $('.js-' + galleryWithPreviewPrefix).on('click', '.js-' + galleryWithPreviewPrefix + '-previews a', function(e) {
            e.preventDefault();    
            $('.js-' + galleryWithPreviewPrefix + '-slide').slick('slickGoTo', $(this).data('slide-index'));
            $('.js-' + galleryWithPreviewPrefix + '-previews a').removeClass('slick-current');
            $(this).addClass('slick-current');
        });
        
        $('.js-' + galleryWithPreviewPrefix + '-slide').slick({
            slidesToShow: 1,
            slidesToScroll: 1,
            arrows: false,
            fade: true,
            arrows: false
        });
        $('.js-' + galleryWithPreviewPrefix + '-previews').slick({
            slidesToShow: 2,
            slidesToScroll: 1,
            dots: false,
            focusOnSelect: true,
            rows: 3,
            responsive: [
                {
                    breakpoint: 951,
                    settings: {
                        slidesToShow: 4,
                        rows: 1
                    }
                },
                {
                    breakpoint: 501,
                    settings: {
                        slidesToShow: 3,
                        rows: 1
                    }
                },
                {
                    breakpoint: 370,
                    settings: {
                        slidesToShow: 2,
                        rows: 1
                    }
                }
            ]
        });
        
    })();
    
});