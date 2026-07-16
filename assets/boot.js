/* 首帧前恢复主题与语言偏好,避免闪变(FOUC)。
 * 必须在 <head> 内同步加载;因 CSP 禁 inline script,故外置本文件。
 * 优先级:URL 参数(?theme=dark&lang=en,仅本次生效不落存储)
 *        > localStorage 偏好 > 浏览器/系统默认。 */
(function () {
  var root = document.documentElement;
  var qs = "";
  try { qs = window.location.search || ""; } catch (e) { /* 保持默认 */ }
  function param(name) {
    var m = qs.match(new RegExp("[?&]" + name + "=([^&]*)"));
    return m ? decodeURIComponent(m[1]) : null;
  }

  var t = param("theme");
  var l = param("lang");
  try {
    if (t !== "light" && t !== "dark") t = localStorage.getItem("scrollery-theme");
    if (l !== "zh" && l !== "en") l = localStorage.getItem("scrollery-lang");
  } catch (e) { /* 无 localStorage 时仅靠参数/默认 */ }

  if (t === "light" || t === "dark") root.dataset.theme = t;
  if (l !== "zh" && l !== "en") {
    l = (navigator.language || "").toLowerCase().indexOf("zh") === 0 ? "zh" : "en";
  }
  root.dataset.lang = l;
  root.lang = l === "zh" ? "zh-CN" : "en";
  root.className += " js";
})();
