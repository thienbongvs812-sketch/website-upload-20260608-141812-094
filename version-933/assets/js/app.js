(function () {
  'use strict';

  function queryAll(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  function setupMobileMenu() {
    var button = document.querySelector('[data-mobile-menu-button]');
    var menu = document.querySelector('[data-mobile-menu]');
    if (!button || !menu) {
      return;
    }

    button.addEventListener('click', function () {
      button.classList.toggle('is-open');
      menu.classList.toggle('is-open');
    });
  }

  function setupHero() {
    var hero = document.querySelector('[data-hero]');
    if (!hero) {
      return;
    }

    var slides = queryAll('[data-hero-slide]', hero);
    var dots = queryAll('[data-hero-dot]', hero);
    var prev = hero.querySelector('[data-hero-prev]');
    var next = hero.querySelector('[data-hero-next]');
    var current = 0;
    var timer = null;

    function show(index) {
      if (!slides.length) {
        return;
      }
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === current);
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function () {
        show(current + 1);
      }, 5000);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
      }
    }

    if (prev) {
      prev.addEventListener('click', function () {
        show(current - 1);
        start();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        show(current + 1);
        start();
      });
    }

    dots.forEach(function (dot, dotIndex) {
      dot.addEventListener('click', function () {
        show(dotIndex);
        start();
      });
    });

    hero.addEventListener('mouseenter', stop);
    hero.addEventListener('mouseleave', start);
    show(0);
    start();
  }

  function normalize(value) {
    return String(value || '').toLowerCase().trim();
  }

  function setupCardFilters() {
    var panels = queryAll('[data-filter-panel]');
    panels.forEach(function (panel) {
      var scope = document.querySelector(panel.getAttribute('data-filter-panel')) || document;
      var input = panel.querySelector('[data-filter-input]');
      var year = panel.querySelector('[data-filter-year]');
      var type = panel.querySelector('[data-filter-type]');
      var cards = queryAll('[data-title]', scope);
      var count = document.querySelector(panel.getAttribute('data-count-target'));

      function apply() {
        var keyword = normalize(input && input.value);
        var yearValue = year ? year.value : '';
        var typeValue = type ? type.value : '';
        var visible = 0;

        cards.forEach(function (card) {
          var text = normalize([
            card.getAttribute('data-title'),
            card.getAttribute('data-region'),
            card.getAttribute('data-type'),
            card.getAttribute('data-tags')
          ].join(' '));
          var matchesKeyword = !keyword || text.indexOf(keyword) !== -1;
          var matchesYear = !yearValue || card.getAttribute('data-year') === yearValue;
          var matchesType = !typeValue || card.getAttribute('data-type') === typeValue;
          var isVisible = matchesKeyword && matchesYear && matchesType;
          card.style.display = isVisible ? '' : 'none';
          if (isVisible) {
            visible += 1;
          }
        });

        if (count) {
          count.textContent = '当前显示 ' + visible + ' 部影片';
        }
      }

      [input, year, type].forEach(function (control) {
        if (control) {
          control.addEventListener('input', apply);
          control.addEventListener('change', apply);
        }
      });

      apply();
    });
  }

  function setupSearchPage() {
    var root = document.querySelector('[data-search-page]');
    if (!root || !window.MOVIE_SEARCH_DATA) {
      return;
    }

    var input = root.querySelector('[data-search-box]');
    var type = root.querySelector('[data-search-type]');
    var year = root.querySelector('[data-search-year]');
    var results = root.querySelector('[data-search-results]');
    var count = root.querySelector('[data-search-count]');
    var prefix = root.getAttribute('data-prefix') || '';

    function escapeHtml(value) {
      return String(value || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
    }

    function card(movie) {
      var tags = (movie.tags || []).slice(0, 3).map(function (tag) {
        return '<span>' + escapeHtml(tag) + '</span>';
      }).join('');
      return '' +
        '<article class="movie-card">' +
        '  <a href="' + prefix + 'movie/' + movie.id + '.html" class="movie-card__link" aria-label="观看 ' + escapeHtml(movie.title) + '">' +
        '    <div class="movie-card__poster">' +
        '      <img src="' + prefix + movie.cover + '.jpg" alt="' + escapeHtml(movie.title) + '" loading="lazy">' +
        '      <span class="movie-card__type">' + escapeHtml(movie.type) + '</span>' +
        '      <span class="movie-card__play">▶</span>' +
        '    </div>' +
        '    <div class="movie-card__body">' +
        '      <div class="movie-card__meta"><span>' + escapeHtml(movie.year) + '</span><span>' + escapeHtml(movie.region) + '</span></div>' +
        '      <h3>' + escapeHtml(movie.title) + '</h3>' +
        '      <p>' + escapeHtml(movie.oneLine || movie.summary || '高清资源，流畅点播。') + '</p>' +
        '      <div class="tag-list">' + tags + '</div>' +
        '    </div>' +
        '  </a>' +
        '</article>';
    }

    function apply() {
      var keyword = normalize(input && input.value);
      var typeValue = type ? type.value : '';
      var yearValue = year ? year.value : '';
      var matches = window.MOVIE_SEARCH_DATA.filter(function (movie) {
        var text = normalize([
          movie.title,
          movie.region,
          movie.type,
          movie.year,
          movie.genre,
          (movie.tags || []).join(' '),
          movie.oneLine
        ].join(' '));
        return (!keyword || text.indexOf(keyword) !== -1) &&
          (!typeValue || movie.type === typeValue) &&
          (!yearValue || movie.year === yearValue);
      });

      var limited = matches.slice(0, 120);
      results.innerHTML = limited.map(card).join('');
      count.textContent = '匹配到 ' + matches.length + ' 部影片，当前展示前 ' + limited.length + ' 部';
      setupImageFallbacks(results);
    }

    [input, type, year].forEach(function (control) {
      if (control) {
        control.addEventListener('input', apply);
        control.addEventListener('change', apply);
      }
    });

    apply();
  }

  function setupPlayer() {
    var player = document.querySelector('[data-player]');
    if (!player) {
      return;
    }

    var video = player.querySelector('video');
    var start = player.querySelector('[data-player-start]');
    var overlay = player.querySelector('[data-player-overlay]');
    var source = video ? video.getAttribute('data-src') : '';
    var initialized = false;

    function initializePlayer() {
      if (!video || !source || initialized) {
        return;
      }
      initialized = true;

      if (window.Hls && window.Hls.isSupported()) {
        var hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hls.loadSource(source);
        hls.attachMedia(video);
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = source;
      } else {
        video.src = source;
      }
    }

    function play() {
      initializePlayer();
      if (overlay) {
        overlay.classList.add('is-hidden');
      }
      var promise = video.play();
      if (promise && promise.catch) {
        promise.catch(function () {
          if (overlay) {
            overlay.classList.remove('is-hidden');
          }
        });
      }
    }

    if (start) {
      start.addEventListener('click', play);
    }

    if (video) {
      video.addEventListener('play', function () {
        if (overlay) {
          overlay.classList.add('is-hidden');
        }
      });
      video.addEventListener('pause', function () {
        if (!video.currentTime) {
          if (overlay) {
            overlay.classList.remove('is-hidden');
          }
        }
      });
    }
  }

  function setupImageFallbacks(root) {
    queryAll('img', root || document).forEach(function (image) {
      image.addEventListener('error', function () {
        image.classList.add('image-fallback');
      }, { once: true });
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    setupMobileMenu();
    setupHero();
    setupCardFilters();
    setupSearchPage();
    setupPlayer();
    setupImageFallbacks(document);
  });
})();
