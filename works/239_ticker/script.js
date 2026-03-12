document.addEventListener('DOMContentLoaded', function () {
    const wrap = document.querySelector('.wrap');
    const ticker = document.querySelector('.ticker');

    if (!wrap || !ticker) return;

    const text = wrap.children[0];
    const tickerWidth = ticker.offsetWidth;

    // Клонируем элементы
    for (let i = 0; i < 5; i++) {
        wrap.appendChild(text.cloneNode(true));
    }

    while (wrap.offsetWidth < tickerWidth * 2) {
        wrap.appendChild(text.cloneNode(true));
    }

    const width = wrap.offsetWidth / 6;

    let iid;
    let offset = 0;

    function start() {
        iid = setInterval(() => {
            offset += 1;

            if (offset >= width) {
                offset = 0;
            }

            wrap.style.transform = `translateX(-${offset}px)`;
        }, 13);
    }

    function stop() {
        clearInterval(iid);
    }

    ticker.addEventListener('mouseenter', stop);
    ticker.addEventListener('mouseleave', start);

    start();
});
