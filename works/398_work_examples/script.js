$(function(){
    let examplesPrefix = 'examples';
        
    $('.js-' + examplesPrefix + '-slider').slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        pauseOnFocus: false,
        pauseOnHover: false,
        asNavFor: '.js-' + examplesPrefix + '-previews'
    });
    
    $('.js-' + examplesPrefix + '-previews').slick({
        slidesToShow: 4,
        slidesToScroll: 1,
        asNavFor: '.js-' + examplesPrefix + '-slider',
        arrows: false
    });
})