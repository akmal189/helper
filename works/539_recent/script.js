$(function(){
    $('.recent-block__list--js').slick({
        slidesToShow: 4,
        slidesToScroll: 1,
        infinite: true,
        arrows: true,
        dots: false,
        responsive: [
            {
                breakpoint: 1200,
                settings: {
                    slidesToShow: 3
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 2
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1
                }
            }
        ]
    })
})