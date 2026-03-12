document.addEventListener('DOMContentLoaded', function() {
    function tabsBlock() {
        const tabBlocks = document.querySelectorAll('.tm_faq_block');
        const tabActive = 'active';
        
        if(!tabBlocks.length) return;

        tabBlocks.forEach(function(tabBlock) {
            const tabTitles = tabBlock.querySelectorAll('.tm_faq_left .tm_faq_title');
            const tabBodies = tabBlock.querySelectorAll('.tm_faq_right .tm_faq_body');

            tabTitles.forEach(function(tabTitle, index) {
                tabTitle.addEventListener('click', function() {
                    tabTitles.forEach(function(t) { t.classList.remove(tabActive); });
                    tabTitle.classList.add(tabActive);

                    tabBodies.forEach(function(b) { b.classList.remove(tabActive); });
                    tabBodies[index].classList.add(tabActive);
                });
            });

            function moveContentForSmallScreens() {
                if (window.innerWidth <= 767) {
                    tabTitles.forEach(function(tabTitle, index) {
                        const tabBody = tabBodies[index];
                        if (!tabTitle.querySelector('.tm_faq_body')) {
                            tabTitle.appendChild(tabBody);
                        }
                    });
                } else {
                    const rightContainer = tabBlock.querySelector('.tm_faq_right');
                    tabBodies.forEach(function(tabBody) {
                        if (rightContainer && !rightContainer.contains(tabBody)) {
                            rightContainer.appendChild(tabBody);
                        }
                    });
                }
            }

            window.addEventListener('resize', moveContentForSmallScreens);
            moveContentForSmallScreens();
        });
    }

    tabsBlock();
});