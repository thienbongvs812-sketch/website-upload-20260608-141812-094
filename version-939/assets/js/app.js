(() => {
    const menuButton = document.querySelector("[data-menu-button]");
    const mobilePanel = document.querySelector("[data-mobile-panel]");

    if (menuButton && mobilePanel) {
        menuButton.addEventListener("click", () => {
            mobilePanel.classList.toggle("is-open");
        });
    }

    const slides = Array.from(document.querySelectorAll("[data-hero-slide]"));
    const dots = Array.from(document.querySelectorAll("[data-hero-dot]"));
    let activeSlide = 0;

    function showSlide(index) {
        if (!slides.length) {
            return;
        }
        activeSlide = (index + slides.length) % slides.length;
        slides.forEach((slide, current) => {
            slide.classList.toggle("is-active", current === activeSlide);
        });
        dots.forEach((dot, current) => {
            dot.classList.toggle("is-active", current === activeSlide);
        });
    }

    dots.forEach((dot) => {
        dot.addEventListener("click", () => {
            showSlide(Number(dot.dataset.heroDot || 0));
        });
    });

    if (slides.length > 1) {
        window.setInterval(() => {
            showSlide(activeSlide + 1);
        }, 5600);
    }

    const searchInput = document.querySelector("[data-search-input]");
    const cards = Array.from(document.querySelectorAll(".js-filter-card"));
    const yearButtons = Array.from(document.querySelectorAll("[data-year-filter]"));
    let activeYear = "all";

    function applyFilters() {
        const query = searchInput ? searchInput.value.trim().toLowerCase() : "";
        cards.forEach((card) => {
            const haystack = [
                card.dataset.title || "",
                card.dataset.region || "",
                card.dataset.tags || "",
                card.dataset.year || ""
            ].join(" ").toLowerCase();
            const matchesQuery = !query || haystack.includes(query);
            const matchesYear = activeYear === "all" || card.dataset.year === activeYear;
            card.style.display = matchesQuery && matchesYear ? "" : "none";
        });
    }

    if (searchInput) {
        const params = new URLSearchParams(window.location.search);
        const initialQuery = params.get("q");
        if (initialQuery) {
            searchInput.value = initialQuery;
        }
        searchInput.addEventListener("input", applyFilters);
    }

    yearButtons.forEach((button) => {
        button.addEventListener("click", () => {
            activeYear = button.dataset.yearFilter || "all";
            yearButtons.forEach((item) => item.classList.remove("is-active"));
            button.classList.add("is-active");
            applyFilters();
        });
    });

    applyFilters();

    const videos = Array.from(document.querySelectorAll(".js-video"));

    videos.forEach((video) => {
        const wrap = video.closest(".video-wrap");
        const button = wrap ? wrap.querySelector("[data-play-button]") : null;
        const playUrl = video.getAttribute("data-play");
        let ready = false;
        let hlsInstance = null;

        function attachVideo() {
            if (ready || !playUrl) {
                return;
            }
            if (video.canPlayType("application/vnd.apple.mpegurl")) {
                video.src = playUrl;
                ready = true;
                return;
            }
            if (window.Hls && window.Hls.isSupported()) {
                hlsInstance = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                hlsInstance.loadSource(playUrl);
                hlsInstance.attachMedia(video);
                ready = true;
                return;
            }
            video.src = playUrl;
            ready = true;
        }

        function startPlayback() {
            attachVideo();
            if (button) {
                button.classList.add("is-hidden");
            }
            const playPromise = video.play();
            if (playPromise && typeof playPromise.catch === "function") {
                playPromise.catch(() => {});
            }
        }

        if (button) {
            button.addEventListener("click", startPlayback);
        }

        video.addEventListener("click", () => {
            if (video.paused) {
                startPlayback();
            }
        });

        video.addEventListener("play", () => {
            if (button) {
                button.classList.add("is-hidden");
            }
        });

        video.addEventListener("pause", () => {
            if (button && video.currentTime === 0) {
                button.classList.remove("is-hidden");
            }
        });

        window.addEventListener("pagehide", () => {
            if (hlsInstance) {
                hlsInstance.destroy();
            }
        });
    });
})();
