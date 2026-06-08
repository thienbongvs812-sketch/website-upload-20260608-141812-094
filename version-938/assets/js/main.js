(function () {
  function ready(callback) {
    if (document.readyState !== "loading") {
      callback();
      return;
    }
    document.addEventListener("DOMContentLoaded", callback);
  }

  ready(function () {
    var menuButton = document.querySelector("[data-menu-button]");
    var mobileNav = document.querySelector("[data-mobile-nav]");

    if (menuButton && mobileNav) {
      menuButton.addEventListener("click", function () {
        mobileNav.classList.toggle("open");
      });
    }

    document.querySelectorAll("[data-hero-carousel]").forEach(function (carousel) {
      var slides = Array.prototype.slice.call(carousel.querySelectorAll("[data-hero-slide]"));
      var dots = Array.prototype.slice.call(carousel.querySelectorAll("[data-hero-dot]"));
      var prev = carousel.querySelector("[data-hero-prev]");
      var next = carousel.querySelector("[data-hero-next]");
      var index = 0;
      var timer = null;

      function show(nextIndex) {
        if (!slides.length) {
          return;
        }
        index = (nextIndex + slides.length) % slides.length;
        slides.forEach(function (slide, slideIndex) {
          slide.classList.toggle("active", slideIndex === index);
        });
        dots.forEach(function (dot, dotIndex) {
          dot.classList.toggle("active", dotIndex === index);
        });
      }

      function schedule() {
        window.clearInterval(timer);
        timer = window.setInterval(function () {
          show(index + 1);
        }, 5500);
      }

      dots.forEach(function (dot) {
        dot.addEventListener("click", function () {
          show(Number(dot.getAttribute("data-hero-dot")) || 0);
          schedule();
        });
      });

      if (prev) {
        prev.addEventListener("click", function () {
          show(index - 1);
          schedule();
        });
      }

      if (next) {
        next.addEventListener("click", function () {
          show(index + 1);
          schedule();
        });
      }

      show(0);
      schedule();
    });

    document.querySelectorAll("[data-filter-panel]").forEach(function (panel) {
      var root = panel.parentElement;
      var input = panel.querySelector("[data-filter-input]");
      var year = panel.querySelector("[data-filter-year]");
      var type = panel.querySelector("[data-filter-type]");
      var items = Array.prototype.slice.call(root.querySelectorAll(".filter-item"));
      var empty = root.querySelector(".empty-state");

      function normalize(value) {
        return String(value || "").trim().toLowerCase();
      }

      function apply() {
        var text = normalize(input && input.value);
        var selectedYear = normalize(year && year.value);
        var selectedType = normalize(type && type.value);
        var visible = 0;

        items.forEach(function (item) {
          var haystack = normalize([
            item.getAttribute("data-title"),
            item.getAttribute("data-region"),
            item.getAttribute("data-year"),
            item.getAttribute("data-type"),
            item.getAttribute("data-genre")
          ].join(" "));
          var itemYear = normalize(item.getAttribute("data-year"));
          var itemType = normalize(item.getAttribute("data-type") + " " + item.getAttribute("data-genre"));
          var matched = true;

          if (text && haystack.indexOf(text) === -1) {
            matched = false;
          }
          if (selectedYear && itemYear !== selectedYear) {
            matched = false;
          }
          if (selectedType && itemType.indexOf(selectedType) === -1) {
            matched = false;
          }

          item.style.display = matched ? "" : "none";
          if (matched) {
            visible += 1;
          }
        });

        if (empty) {
          empty.classList.toggle("show", visible === 0);
        }
      }

      [input, year, type].forEach(function (field) {
        if (field) {
          field.addEventListener("input", apply);
          field.addEventListener("change", apply);
        }
      });

      apply();
    });
  });
})();
