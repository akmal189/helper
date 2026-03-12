(() => {
    'use strict';

    class VideoSlider {
        constructor(selector = '.video-slider__item') {
            this.selector = selector;
            this.items = [];
        }

        init() {
            let wrappers = document.querySelectorAll(this.selector);

            for (let wrapper of wrappers) {
                let item = new VideoSliderItem(wrapper).init();
                this.items.push(item);
            }
        }
    }

    class VideoSliderItem {
        constructor(el) {
            this.wrapper = el;
            this.videoEl = null;
            this.playEl = null;
            this.onPlayElClick = this.onPlayElClick.bind(this);
            this.onVideoElPlay = this.onVideoElPlay.bind(this);
            this.onVideoElPause = this.onVideoElPause.bind(this);
        }

        init() {
            let wrapper = this.wrapper;

            let videoEl = this.videoEl = wrapper.querySelector('video');
            let playEl = this.playEl = wrapper.querySelector('.video-slider__play');

            if (playEl) {
                playEl.addEventListener('click', this.onPlayElClick);
            }

            if (videoEl) {
                videoEl.addEventListener('play', this.onVideoElPlay);
                videoEl.addEventListener('pause', this.onVideoElPause);
                videoEl.addEventListener('ended', this.onVideoElPause);
            }

            return this;
        }

        onPlayElClick() {
            this.videoEl.play();
        }

        onVideoElPlay() {
        	this.videoEl.controls = true;
        	
            if (this.playEl) {
                this.playEl.style.display = 'none';
            }
        }

        onVideoElPause() {
            if (this.playEl) {
                this.playEl.style.display = 'block';
            }
        }
    }

    window.VideoSlider = VideoSlider;
})();