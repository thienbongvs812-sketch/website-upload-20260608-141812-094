(function () {
    function mountPlayer(id, url) {
        var panel = document.getElementById(id);

        if (!panel) {
            return;
        }

        var video = panel.querySelector('video');
        var cover = panel.querySelector('.player-cover');
        var buttons = Array.prototype.slice.call(panel.querySelectorAll('[data-play]'));
        var attached = false;

        function attach() {
            if (attached || !video) {
                return;
            }

            attached = true;

            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = url;
            } else if (window.Hls && window.Hls.isSupported()) {
                var hls = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });

                hls.loadSource(url);
                hls.attachMedia(video);
            } else {
                video.src = url;
            }
        }

        function start() {
            attach();
            panel.classList.add('is-playing');
            video.setAttribute('controls', 'controls');

            var promise = video.play();

            if (promise && typeof promise.catch === 'function') {
                promise.catch(function () {});
            }
        }

        buttons.forEach(function (button) {
            button.addEventListener('click', start);
        });

        if (cover) {
            cover.addEventListener('click', start);
        }

        if (video) {
            video.addEventListener('click', function () {
                if (video.paused) {
                    start();
                }
            });
        }
    }

    window.mountPlayer = mountPlayer;
})();
