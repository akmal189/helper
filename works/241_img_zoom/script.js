$(function () {
    var $imgs = $('.thumbs .shop2-product-item').find('.product-image img');

    $imgs.each(function () {
        var $img = $(this);
        var bigSrc = $img.attr('data-big');  // добавить атрибут data-big с ссылкой на большое изображение картинке

        if (bigSrc) {
            $img.attr('data-zoom-image', bigSrc);
        }
    });

    $imgs.each(function () {
        var $img = $(this);

        var api = $img.data('elevateZoom');
        if (api && api.destroy) {
            api.destroy();
            $('.zoomContainer').remove();
        }

        var imgOffset = $img.offset();
        var imgWidth = $img.outerWidth();
        var winWidth = $(window).width();

        var zoomW = 350;
        var zoomH = 350;

        var fitsRight = (imgOffset.left + imgWidth + 10 + zoomW) <= winWidth;
        var position = fitsRight ? 1 : 11;

        var wrap = $img.parents('.shop2-product-item, .shop2-product').first();
        var imgPos = imgOffset.top;
        var wrapPos = wrap.length ? wrap.offset().top : imgPos;
        var posY = (wrapPos - imgPos) / 2;

        $img.elevateZoom({
            zoomWindowPosition: position,
            zoomWindowOffsetX: 10,
            zoomWindowOffsetY: posY,
            zoomWindowHeight: zoomH,
            zoomWindowWidth: zoomW,
            borderSize: 3,
            cursor: 'none',
            borderColour: '#2bd0c3',
            lensBorderSize: 2,
            lensBorderColour: '#2bd0c3',
            lensOpacity: 1,
            lensColour: 'rgba(255,255,255,0.4)'
        });
    });
})