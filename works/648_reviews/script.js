(() => {
    'use strict';

    class ReviewVideoPopup {
        constructor() {
            this.wrapperEl = null;
            this.scrollWrapperEl = null;
            this.contentEl = null;
            this.bodyEl = null;
            this.bodyPaddingRight = 0;
        }
        
        init() {
            let	wrapperEl = null,
                scrollWrapperEl = null,
                closeEl = null,
                bodyEl = this.bodyEl = document.body;
    
            bodyEl.insertAdjacentHTML('beforeend', `
                <div class="review-video-popup-wrapper">
                    <div class="review-video-popup-bg"></div>
                    <div class="review-video-popup-scroll-wrapper">
                        <div class="review-video-popup">
                            <div class="review-video-popup__close"></div>
                            <div class="review-video-popup__content"></div>
                        </div>
                    </div>
                </div>
            `);
            
            wrapperEl = this.wrapperEl = document.querySelector('.review-video-popup-wrapper');
            
            if (wrapperEl) {
                scrollWrapperEl = this.scrollWrapperEl = wrapperEl.querySelector('.review-video-popup-scroll-wrapper');
                closeEl = wrapperEl.querySelector('.review-video-popup__close');
                this.contentEl = wrapperEl.querySelector('.review-video-popup__content');
            }
            
            if (scrollWrapperEl) {
                scrollWrapperEl.addEventListener('click', (e) => {
                    if (e.target === e.currentTarget) {
                        this.hide();
                        $('.review-video-popup__content').html('')
                    }
                });
            }
            
            if (closeEl) {
                closeEl.addEventListener('click', () => {
                    this.hide();
                    $('.review-video-popup__content').html('')
                });
            }
            
            document.addEventListener('click', (e) => {
                let reviewVideoEl = e.target.closest('.reviews-item__video-poster');
                
                if (reviewVideoEl && reviewVideoEl.dataset.html) {
                    e.preventDefault();
                    
                    this.show(reviewVideoEl.dataset.html);
                }
            });
            
            return this;
        }
        
        show(content) {
            
            let wrapperEl = this.wrapperEl,
                contentEl = this.contentEl,
                bodyEl = this.bodyEl;
            
            if (content && wrapperEl && contentEl && bodyEl) {
                let bodyStyle = window.getComputedStyle(bodyEl),
                    bodyPaddingRight = this.bodyPaddingRight = parseInt(bodyStyle.paddingRight),
                    scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
                
                document.documentElement.classList.add('review-video-popup-overflow-hidden');
                bodyEl.style.paddingRight = (bodyPaddingRight + scrollBarWidth) + 'px';
                contentEl.innerHTML = content;
                wrapperEl.style.display = 'block';
                
                setTimeout(() => {
                    wrapperEl.classList.add('review-video-popup-wrapper--visible');
                }, 0);
            }
        }
        
        hide() {
            let wrapperEl = this.wrapperEl,
                scrollWrapperEl = this.scrollWrapperEl,
                contentEl = this.contentEl;
            
            if (wrapperEl) {
                let scrollWrapperElStyle = null,
                    transitionDuration = null;
                
                if (scrollWrapperEl) {
                    scrollWrapperElStyle = window.getComputedStyle(scrollWrapperEl);
                    transitionDuration = parseFloat(scrollWrapperElStyle.transitionDuration) * 1000;
                }
                
                if (transitionDuration) {
                    scrollWrapperEl.addEventListener('transitionend', () => {
                        this.hideWrapper();
                    }, {once: true});
                } else {
                    setTimeout(() => {
                        this.hideWrapper();
                    }, 0);
                }
                
                wrapperEl.classList.remove('review-video-popup-wrapper--visible');
                
            }
            
            if (contentEl) {
                let iframe = contentEl.querySelector('iframe');
                
                if (iframe) {
                    let iframeWin = iframe.contentWindow;
                    
                    iframeWin.postMessage(JSON.stringify({ event: "command", func: "pauseVideo", args: "" }), '*'); // YouTube iframe GET-params 'enablejsapi=1&version=3'
                }
            }
        }
        
        hideWrapper() {
            let wrapperEl = this.wrapperEl,
                bodyEl = this.bodyEl;
            
            if (wrapperEl && bodyEl) {
                wrapperEl.style.display = 'none';
                bodyEl.style.paddingRight = this.bodyPaddingRight + 'px';
                document.documentElement.classList.remove('review-video-popup-overflow-hidden');
            }
        }
    }
    
    document.addEventListener('DOMContentLoaded', () => {
        var slider = tns({
            container: '.reviews__items',
            items: 1,
            autoplay: false,
            nav: false,
            loop: true,
            autoplayButtonOutput: false,
            autoHeight: true,
            prevButton: '.reviews__prev-button',
            nextButton: '.reviews__next-button',
            navContainer: '.reviews__nav',
            navAsThumbnails: false,
            gutter: 53,
            slideBy: 'page',
            responsive: {
                1441:{
                    items: 4
                    
                },
                1025:{
                    items: 4
                    
                },
                768:{
                    
                    items: 2
                    
                }
            }
        });
        
        new ReviewVideoPopup().init();
    });

})();

(function(){
    function headerInfoInit() {
        function show() {
            let el = document.querySelector('.reviews__more');
            
            if (el) {
                el.style.display = '';
            }
        }
        
        
        let observer = new MutationObserver(mutations => {
            for(let mutation of mutations) {
            for(let node of mutation.addedNodes) {
                if (!(node instanceof HTMLElement)) continue;
        
                if (node.matches('.reviews__more')) {
                let headerInfoClosedAt = window.localStorage.getItem('header-info-closed-at');
                
                if (headerInfoClosedAt) {
                    let headerInfoClosedAtDate = new Date(parseInt(headerInfoClosedAt)),
                        headerInfoMustOpenAtDate = new Date(parseInt(headerInfoClosedAt));
                        
                    headerInfoMustOpenAtDate.setDate(headerInfoClosedAtDate.getDate() + 1);
                    headerInfoMustOpenAtDate.setHours(0,0,0,0);
                    
                    if (Date.now() >= headerInfoMustOpenAtDate.getTime()) {
                        show();
                    }
                } else {
                    show();
                }
                
                observer.disconnect();
                }
            }
            }
        
        });
        
        observer.observe(document.documentElement, {childList: true, subtree: true});
        
        document.addEventListener('DOMContentLoaded', function() {
            observer.disconnect();
            
            let closeEl = document.querySelector('.header-info-close');
            
            if (closeEl) {
                closeEl.addEventListener('click', function() {
                    close();
                });
            }
        });
        
    }
    
    headerInfoInit();
})();