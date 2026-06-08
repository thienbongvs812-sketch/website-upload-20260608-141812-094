(function () {
    var menuButton = document.querySelector('[data-menu-toggle]');
    var navMenu = document.querySelector('[data-nav-menu]');

    if (menuButton && navMenu) {
        menuButton.addEventListener('click', function () {
            navMenu.classList.toggle('is-open');
        });
    }

    var carousel = document.querySelector('[data-hero-carousel]');

    if (carousel) {
        var slides = Array.prototype.slice.call(carousel.querySelectorAll('[data-hero-slide]'));
        var dots = Array.prototype.slice.call(carousel.querySelectorAll('[data-hero-dot]'));
        var activeIndex = 0;

        function setSlide(index) {
            activeIndex = index;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('is-active', slideIndex === activeIndex);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('is-active', dotIndex === activeIndex);
            });
        }

        dots.forEach(function (dot) {
            dot.addEventListener('click', function () {
                var index = Number(dot.getAttribute('data-hero-dot')) || 0;
                setSlide(index);
            });
        });

        if (slides.length > 1) {
            window.setInterval(function () {
                setSlide((activeIndex + 1) % slides.length);
            }, 5600);
        }
    }

    var searchInput = document.querySelector('[data-filter-input]');
    var typeFilter = document.querySelector('[data-type-filter]');
    var items = Array.prototype.slice.call(document.querySelectorAll('[data-search-item]'));

    function applyFilters() {
        var keyword = searchInput ? searchInput.value.trim().toLowerCase() : '';
        var typeValue = typeFilter ? typeFilter.value : '';

        items.forEach(function (item) {
            var haystack = [
                item.getAttribute('data-title') || '',
                item.getAttribute('data-year') || '',
                item.getAttribute('data-region') || '',
                item.getAttribute('data-type') || '',
                item.getAttribute('data-genre') || ''
            ].join(' ').toLowerCase();
            var itemType = item.getAttribute('data-type') || '';
            var keywordMatched = !keyword || haystack.indexOf(keyword) !== -1;
            var typeMatched = !typeValue || itemType === typeValue;

            item.classList.toggle('is-hidden', !(keywordMatched && typeMatched));
        });
    }

    if (searchInput) {
        searchInput.addEventListener('input', applyFilters);
    }

    if (typeFilter) {
        typeFilter.addEventListener('change', applyFilters);
    }
})();
