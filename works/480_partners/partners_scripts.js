$(function(){
    $('.partners-block__slider.js-slider-init').slick({
        dots: true,
        arrows: true,
        infinite: true,
        speed: 1000,				
        autoplay: true,
        autoplaySpeed: 3000,
        draggable: true,
        slidesToShow: 5,
        appendArrows: '.partners-block__arrows',
        responsive: [
            {
                breakpoint: 981,
                settings: {
                slidesToShow: 4,
                arrows: false
                }
            },
            {
                breakpoint: 769,
                settings: {
                slidesToShow: 3,
                arrows: false
                }
            },
            {
                breakpoint: 641,
                settings: {
                slidesToShow: 2,
                arrows: false
                }
            }
            ]
    })
})