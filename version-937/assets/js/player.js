(function () {
    function setupMoviePlayer(streamUrl) {
        var video = document.getElementById('movie-player');
        var playButton = document.getElementById('play-button');

        if (!video || !playButton || !streamUrl) {
            return;
        }

        var prepared = false;
        var hlsInstance = null;

        function preparePlayer() {
            if (prepared) {
                return;
            }

            prepared = true;

            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = streamUrl;
                return;
            }

            if (window.Hls && window.Hls.isSupported()) {
                hlsInstance = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                hlsInstance.loadSource(streamUrl);
                hlsInstance.attachMedia(video);
                return;
            }

            video.src = streamUrl;
        }

        function startPlayback() {
            preparePlayer();
            playButton.classList.add('is-hidden');
            var playResult = video.play();

            if (playResult && typeof playResult.catch === 'function') {
                playResult.catch(function () {
                    playButton.classList.remove('is-hidden');
                });
            }
        }

        preparePlayer();

        playButton.addEventListener('click', startPlayback);

        video.addEventListener('click', function () {
            if (video.paused) {
                startPlayback();
            }
        });

        video.addEventListener('play', function () {
            playButton.classList.add('is-hidden');
        });

        video.addEventListener('pause', function () {
            if (video.currentTime === 0) {
                playButton.classList.remove('is-hidden');
            }
        });

        window.addEventListener('beforeunload', function () {
            if (hlsInstance) {
                hlsInstance.destroy();
            }
        });
    }

    window.setupMoviePlayer = setupMoviePlayer;
})();
