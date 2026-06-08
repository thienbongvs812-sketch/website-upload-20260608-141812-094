(function () {
  function startMoviePlayer(source) {
    var video = document.getElementById("movie-player");
    var starter = document.querySelector(".player-start");
    var frame = document.querySelector(".player-frame");
    var attached = false;
    var hls = null;

    if (!video || !starter || !frame || !source) {
      return;
    }

    function attach() {
      if (attached) {
        return;
      }

      attached = true;

      if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 90
        });
        hls.loadSource(source);
        hls.attachMedia(video);
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = source;
      } else {
        video.src = source;
      }
    }

    function play() {
      attach();
      frame.classList.add("is-playing");
      var promise = video.play();

      if (promise && promise.catch) {
        promise.catch(function () {
          frame.classList.remove("is-playing");
        });
      }
    }

    starter.addEventListener("click", function (event) {
      event.preventDefault();
      play();
    });

    frame.addEventListener("click", function (event) {
      if (event.target === frame || event.target === video) {
        play();
      }
    });

    video.addEventListener("play", function () {
      frame.classList.add("is-playing");
    });

    video.addEventListener("ended", function () {
      frame.classList.remove("is-playing");
    });

    window.addEventListener("beforeunload", function () {
      if (hls) {
        hls.destroy();
      }
    });
  }

  window.startMoviePlayer = startMoviePlayer;
})();
