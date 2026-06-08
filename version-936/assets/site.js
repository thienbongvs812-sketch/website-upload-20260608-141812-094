(function () {
    var menuToggle = document.querySelector('[data-menu-toggle]');
    var mobileNav = document.querySelector('[data-mobile-nav]');

    if (menuToggle && mobileNav) {
        menuToggle.addEventListener('click', function () {
            mobileNav.classList.toggle('is-open');
        });
    }

    var hero = document.querySelector('[data-hero-stage]');

    if (hero) {
        var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
        var dots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));
        var current = 0;

        function showSlide(index) {
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

        dots.forEach(function (dot, index) {
            dot.addEventListener('click', function () {
                showSlide(index);
            });
        });

        showSlide(0);

        if (slides.length > 1) {
            setInterval(function () {
                showSlide(current + 1);
            }, 5000);
        }
    }

    var lists = Array.prototype.slice.call(document.querySelectorAll('[data-filter-list]'));

    lists.forEach(function (list) {
        var scope = list.closest('[data-filter-scope]') || document;
        var input = scope.querySelector('[data-search-input]');
        var region = scope.querySelector('[data-region-select]');
        var type = scope.querySelector('[data-type-select]');
        var chips = Array.prototype.slice.call(scope.querySelectorAll('[data-filter-chip]'));
        var activeCategory = '';

        function normalize(value) {
            return String(value || '').trim().toLowerCase();
        }

        function applyFilter() {
            var keyword = normalize(input ? input.value : '');
            var regionValue = normalize(region ? region.value : '');
            var typeValue = normalize(type ? type.value : '');
            var items = Array.prototype.slice.call(list.querySelectorAll('[data-filter-item]'));

            items.forEach(function (item) {
                var text = normalize(item.getAttribute('data-search'));
                var itemRegion = normalize(item.getAttribute('data-region'));
                var itemType = normalize(item.getAttribute('data-type'));
                var itemCategory = normalize(item.getAttribute('data-category'));
                var matched = true;

                if (keyword && text.indexOf(keyword) === -1) {
                    matched = false;
                }

                if (regionValue && itemRegion.indexOf(regionValue) === -1) {
                    matched = false;
                }

                if (typeValue && itemType.indexOf(typeValue) === -1) {
                    matched = false;
                }

                if (activeCategory && itemCategory !== activeCategory) {
                    matched = false;
                }

                item.classList.toggle('hidden-by-filter', !matched);
            });
        }

        if (input) {
            input.addEventListener('input', applyFilter);
        }

        if (region) {
            region.addEventListener('change', applyFilter);
        }

        if (type) {
            type.addEventListener('change', applyFilter);
        }

        chips.forEach(function (chip) {
            chip.addEventListener('click', function () {
                var value = normalize(chip.getAttribute('data-filter-chip'));
                activeCategory = activeCategory === value ? '' : value;

                chips.forEach(function (other) {
                    other.classList.toggle('is-active', other === chip && activeCategory !== '');
                });

                applyFilter();
            });
        });
    });
})();
