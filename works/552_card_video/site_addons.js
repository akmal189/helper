document.addEventListener('DOMContentLoaded', function(){
	let wrappers = document.querySelectorAll('.card-slider__items-slider');
    	
	for (let wrapper of wrappers) {
		
		lightGallery(wrapper, {
			selector: '.card-slider__image a',
            hash: false,
            share: false,
            thumbnail: false,
            autoplay: false,
            autoplayControls: false,
            zoom: false,
            fullScreen: false,
            download: false,
            getCaptionFromTitleOrAlt: true
		});
	}
})