/* 站点交互:主题/语言切换、顶栏投影、展卷滚动驱动。零依赖。 */
(function () {
  "use strict";
  var root = document.documentElement;

  /* ── 主题切换 ── */
  var themeBtn = document.getElementById("themeBtn");
  if (themeBtn) {
    themeBtn.addEventListener("click", function () {
      var dark = root.dataset.theme === "dark" ||
        (!root.dataset.theme && matchMedia("(prefers-color-scheme: dark)").matches);
      var next = dark ? "light" : "dark";
      root.dataset.theme = next;
      try { localStorage.setItem("scrollery-theme", next); } catch (e) { /* 忽略 */ }
    });
  }

  /* ── 语言切换 ── */
  var langBtn = document.getElementById("langBtn");
  function paintLangBtn() {
    if (langBtn) langBtn.textContent = root.dataset.lang === "zh" ? "EN" : "中文";
  }
  if (langBtn) {
    langBtn.addEventListener("click", function () {
      var next = root.dataset.lang === "zh" ? "en" : "zh";
      root.dataset.lang = next;
      root.lang = next === "zh" ? "zh-CN" : "en";
      try { localStorage.setItem("scrollery-lang", next); } catch (e) { /* 忽略 */ }
      paintLangBtn();
    });
    paintLangBtn();
  }

  /* ── 顶栏:滚动后显示分隔线 ── */
  var head = document.querySelector(".site-head");
  function paintHead() {
    if (head) head.classList.toggle("scrolled", window.scrollY > 4);
  }
  paintHead();

  /* ── 展卷:纵向滚动进度 → 横向位移(reduced-motion / 窄屏不启用) ── */
  var section = document.querySelector(".unroll");
  var track = document.querySelector(".unroll-track");
  var paper = document.querySelector(".unroll-paper");
  var dots = Array.prototype.slice.call(document.querySelectorAll(".unroll-dots .dot"));
  var reduce = matchMedia("(prefers-reduced-motion: reduce)");
  var narrow = matchMedia("(max-width: 880px)");

  function unrollActive() {
    return section && track && paper && !reduce.matches && !narrow.matches;
  }
  function progress() {
    var range = section.offsetHeight - window.innerHeight;
    if (range <= 0) return 0;
    var p = (window.scrollY - section.offsetTop) / range;
    return Math.min(1, Math.max(0, p));
  }
  function applyUnroll() {
    if (!unrollActive()) return;
    var p = progress();
    var max = track.scrollWidth - paper.clientWidth + 88; /* 88 ≈ paper 两侧内边距 */
    if (max < 0) max = 0;
    track.style.transform = "translateX(" + (-p * max).toFixed(1) + "px)";
    if (dots.length) {
      var idx = Math.min(dots.length - 1, Math.floor(p * dots.length));
      dots.forEach(function (d, i) {
        d.setAttribute("aria-current", i === idx ? "true" : "false");
      });
    }
  }
  dots.forEach(function (d, i) {
    d.addEventListener("click", function () {
      if (!unrollActive()) return;
      var frac = dots.length > 1 ? i / (dots.length - 1) : 0;
      var range = section.offsetHeight - window.innerHeight;
      window.scrollTo({ top: section.offsetTop + frac * range, behavior: "smooth" });
    });
  });

  /* rAF 节流的滚动/缩放驱动 */
  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      ticking = false;
      paintHead();
      applyUnroll();
    });
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
  applyUnroll();
})();
