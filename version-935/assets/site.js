(function () {
    function ready(callback) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", callback);
            return;
        }
        callback();
    }

    function initMobileMenu() {
        var toggle = document.querySelector("[data-mobile-toggle]");
        var panel = document.querySelector("[data-mobile-panel]");
        if (!toggle || !panel) {
            return;
        }
        toggle.addEventListener("click", function () {
            panel.classList.toggle("is-open");
        });
    }

    function initHero() {
        var hero = document.querySelector("[data-hero]");
        if (!hero) {
            return;
        }
        var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
        var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
        var prev = hero.querySelector("[data-hero-prev]");
        var next = hero.querySelector("[data-hero-next]");
        var index = 0;
        var timer = null;

        function show(target) {
            if (!slides.length) {
                return;
            }
            index = (target + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle("is-active", slideIndex === index);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle("is-active", dotIndex === index);
            });
        }

        function play() {
            stop();
            timer = window.setInterval(function () {
                show(index + 1);
            }, 5000);
        }

        function stop() {
            if (timer) {
                window.clearInterval(timer);
                timer = null;
            }
        }

        dots.forEach(function (dot, dotIndex) {
            dot.addEventListener("click", function () {
                show(dotIndex);
                play();
            });
        });

        if (prev) {
            prev.addEventListener("click", function () {
                show(index - 1);
                play();
            });
        }

        if (next) {
            next.addEventListener("click", function () {
                show(index + 1);
                play();
            });
        }

        hero.addEventListener("mouseenter", stop);
        hero.addEventListener("mouseleave", play);
        show(0);
        play();
    }

    function uniqueValues(cards, name) {
        var values = [];
        cards.forEach(function (card) {
            var value = (card.dataset[name] || "").trim();
            if (value && values.indexOf(value) === -1) {
                values.push(value);
            }
        });
        values.sort(function (a, b) {
            return b.localeCompare(a, "zh-CN");
        });
        return values;
    }

    function fillSelect(select, values) {
        if (!select) {
            return;
        }
        values.forEach(function (value) {
            var option = document.createElement("option");
            option.value = value;
            option.textContent = value;
            select.appendChild(option);
        });
    }

    function initFilters() {
        var scopes = Array.prototype.slice.call(document.querySelectorAll("[data-filter-scope]"));
        scopes.forEach(function (scope) {
            var section = scope.closest("section") || document;
            var cards = Array.prototype.slice.call(section.querySelectorAll("[data-movie-card]"));
            var input = scope.querySelector("[data-filter-input]");
            var yearSelect = scope.querySelector("[data-filter-year]");
            var regionSelect = scope.querySelector("[data-filter-region]");
            var typeSelect = scope.querySelector("[data-filter-type]");

            fillSelect(yearSelect, uniqueValues(cards, "year"));
            fillSelect(regionSelect, uniqueValues(cards, "region"));
            fillSelect(typeSelect, uniqueValues(cards, "type"));

            function apply() {
                var query = input ? input.value.trim().toLowerCase() : "";
                var year = yearSelect ? yearSelect.value : "";
                var region = regionSelect ? regionSelect.value : "";
                var type = typeSelect ? typeSelect.value : "";
                cards.forEach(function (card) {
                    var text = [
                        card.dataset.title,
                        card.dataset.region,
                        card.dataset.type,
                        card.dataset.year,
                        card.dataset.genre,
                        card.dataset.category
                    ].join(" ").toLowerCase();
                    var visible = true;
                    if (query && text.indexOf(query) === -1) {
                        visible = false;
                    }
                    if (year && card.dataset.year !== year) {
                        visible = false;
                    }
                    if (region && card.dataset.region !== region) {
                        visible = false;
                    }
                    if (type && card.dataset.type !== type) {
                        visible = false;
                    }
                    card.classList.toggle("is-hidden", !visible);
                });
            }

            [input, yearSelect, regionSelect, typeSelect].forEach(function (control) {
                if (control) {
                    control.addEventListener("input", apply);
                    control.addEventListener("change", apply);
                }
            });

            var params = new URLSearchParams(window.location.search);
            var query = params.get("q");
            if (query && input) {
                input.value = query;
            }
            apply();
        });
    }

    window.initMoviePlayer = function (streamUrl) {
        ready(function () {
            var video = document.getElementById("movie-video");
            var overlay = document.querySelector("[data-player-overlay]");
            if (!video || !streamUrl) {
                return;
            }
            var loaded = false;
            var hls = null;

            function attach() {
                if (loaded) {
                    return;
                }
                loaded = true;
                if (video.canPlayType("application/vnd.apple.mpegurl")) {
                    video.src = streamUrl;
                    return;
                }
                if (window.Hls && window.Hls.isSupported()) {
                    hls = new window.Hls({
                        maxBufferLength: 30,
                        enableWorker: true
                    });
                    hls.loadSource(streamUrl);
                    hls.attachMedia(video);
                    return;
                }
                video.src = streamUrl;
            }

            function start() {
                attach();
                if (overlay) {
                    overlay.classList.add("is-hidden");
                }
                video.setAttribute("controls", "controls");
                var playAction = video.play();
                if (playAction && typeof playAction.catch === "function") {
                    playAction.catch(function () {});
                }
            }

            if (overlay) {
                overlay.addEventListener("click", start);
            }
            video.addEventListener("click", function () {
                if (!loaded) {
                    start();
                }
            });
            window.addEventListener("pagehide", function () {
                if (hls && typeof hls.destroy === "function") {
                    hls.destroy();
                }
            });
        });
    };

    ready(function () {
        initMobileMenu();
        initHero();
        initFilters();
    });
})();
