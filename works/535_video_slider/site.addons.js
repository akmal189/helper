(() => {
    'use strict';

    document.addEventListener('DOMContentLoaded', () => {
        new VideoSlider().init();
		
		let sliderViewportAlignHeight = (info) => {
			let container = info.container,
        		viewportEls = container.querySelectorAll('.video-slider__viewport'),
        		maxHeight = 0;
        		
			if (window.matchMedia('(max-width: 767px)').matches) {
	            for (let viewportEl of viewportEls) {
	            	if (viewportEl.style.height) {
						viewportEl.style.height = '';
					}
	            	
	            	let viewportHeight = viewportEl.offsetHeight;
	            	
	            	maxHeight = viewportHeight > maxHeight ? viewportHeight : maxHeight;
	            }
	            
	            for (let viewportEl of viewportEls) {
	            	viewportEl.style.height = maxHeight + 'px';
	            }
			} else {
				for (let viewportEl of viewportEls) {
					if (viewportEl.style.height) {
						viewportEl.style.height = '';
					}
				}
			}
		};
		
		let sliderNavContainerPosition = (info) => {
			let indexNext = info.index,
        		itemNext = info.slideItems[indexNext],
        		viewportNextEl = itemNext.querySelector('.video-slider__viewport'),
            	navContainer = info.navContainer,
            	offsetBottom = 10;
            	
            if (viewportNextEl && navContainer) {
	            if (window.matchMedia('(max-width: 767px)').matches) {
	            	navContainer.style.bottom = (itemNext.offsetHeight - viewportNextEl.offsetHeight + offsetBottom) + 'px';
	            } else {
	            	if (navContainer.style.bottom) {
	            		navContainer.style.bottom = '';
	            	}
	            }
            }
		};
		
        let slider = tns({
            container: '.video-slider',
            items: 1,
            navPosition: 'bottom',
            loop: false,
            autoHeight: false,
            gutter: 15,
            controls: false,
            responsive: {
            	768: {
            		gutter: 0,
            	},
            	1024: {
            		controls: true
            	}
            },
            onInit: (info) => {
            	let resizeTimeoutId;
                	
                sliderViewportAlignHeight(info);
                sliderNavContainerPosition(info);
	            
	            window.addEventListener('resize', () => {
	            	if (resizeTimeoutId) {
	            		clearTimeout(resizeTimeoutId);
	            	}
	            	resizeTimeoutId = setTimeout(() => {
	            		let info = slider.getInfo();
	            		
	            		sliderViewportAlignHeight(info);
	            		sliderNavContainerPosition(info);
	            	}, 250);
	            });
	            
	            console.log(111)
	            $('.video-slider__item').eq('0').find('.video-slider__play').click();
            }
        });

        slider.events.on('indexChanged', (info) => {
            let indexPrev = info.indexCached,
                itemPrev = info.slideItems[indexPrev],
                videoPrevEl = itemPrev.querySelector('video'),
                iframePrevEl = itemPrev.querySelector('iframe');

            if (videoPrevEl) {
                videoPrevEl.pause();
            }
            
            if (iframePrevEl) {
            	let iframeWin = iframePrevEl.contentWindow;
            	
            	iframeWin.postMessage(JSON.stringify({ event: "command", func: "pauseVideo", args: "" }), '*');
            }
            
            $('.tns-slide-active .video-slider__play').click();
            
            sliderViewportAlignHeight(info);
            sliderNavContainerPosition(info);
        });
        
    });
})();

$(function(){
	$(window).load(function(){
		setTimeout(function(){
			$('.video-slider__item').eq('0').find('.video-slider__play').click();
			console.log(1)
		}, 10)
	})
})