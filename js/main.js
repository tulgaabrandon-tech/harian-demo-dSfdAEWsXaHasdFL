/* Hairan homepage behaviour: renders listings, category filter, "show more",
   mobile menu and the МН / EN switch. No dependencies. */
(function () {
  "use strict";
  var D = window.HAIRAN_DATA;
  var SPRITE = "#i-";
  var lang = "mn";
  var filter = "all";
  var expanded = false;
  var FIRST = 8;

  var EN = {
    "skip": "Skip to content",
    "nav.map": "Map", "nav.guide": "How it works", "nav.partner": "Become a partner",
    "cta.app": "Get the app", "cta.appLong": "Get the app (Android)", "cta.login": "Log in",
    "hero.title": "What's in the <em>lucky bag</em>?",
    "hero.lead": "<strong>2–3 times cheaper than the real market price.</strong> Bakeries, cafés and pastry shops across Ulaanbaatar.",
    "hero.cta": "See lucky bags", "hero.place": "Ulaanbaatar",
    "bags.title": "Ending soon", "bags.sub": "Bags with pickup times coming up soon.",
    "bags.all": "See all on the map", "bags.more": "Show more bags", "bags.less": "Show fewer",
    "chip.all": "All", "chip.bread": "Bread", "chip.pastry": "Pastry", "chip.cake": "Cake",
    "tmr.title": "New for tomorrow", "tmr.sub": "New bags you can pick up tomorrow.",
    "how.label": "Lucky bag", "how.title": "How does it work?",
    "how.p1": "Each bag has a set category, but what's inside changes every day. 2–3 times cheaper than the real market price.",
    "how.pickup": "No delivery. Pick up your bag at the shop.",
    "s1.t": "Choose a bag", "s1.p": "Pick a lucky bag in the app or on the site.",
    "s2.t": "Pay with QPay", "s2.p": "Pay for your order in advance.",
    "s3.t": "Get your pickup code", "s3.p": "Your pickup code appears once payment goes through.",
    "s4.t": "Pick it up", "s4.p": "Go during the shop's pickup time, say your code and take your bag.",
    "rules.title": "Before you order", "rules.link": "How it works",
    "r1.t": "Cancelling", "r1.p": "Cancel at least 3 hours before pickup starts for a full refund.",
    "r2.t": "If you don't pick up", "r2.p": "No refund. If the shop cancels your order, you get a full refund.",
    "r3.t": "Refunds", "r3.p": "Instantly as points (1 point = 1₮) or to your bank account within 24 hours. You choose.",
    "r4.t": "Allergies", "r4.p": "Every bag lists allergens and warnings. If unsure, contact the shop before ordering.",
    "shops.title": "Partner places", "shops.sub": "Pick up your lucky bag from these places.",
    "partner.label": "Business partners", "partner.title": "We'd love to work with you",
    "partner.p": "Sell your products on Hairan as lucky bags.", "partner.cta": "Become a partner",
    "perk1": "Verify your phone number and your business profile is created automatically.",
    "perk2": "Your partner rank goes up with your sales.",
    "perk3": "Each rank adds perks such as a certificate, a shop badge and top placement in your district.",
    "foot.about": "Lucky bags 2–3 times cheaper than the real market price. Ulaanbaatar.",
    "foot.service": "Service", "foot.business": "Business", "foot.contact": "Contact",
    "legal.pay": "Payment terms", "legal.terms": "Terms of service", "legal.privacy": "Privacy policy", "legal.ds": "Design system",
    "cta.appView": "View app", "app.title": "Hairan app", "app.close": "Close",
    "app.desc": "A design of the app home screen. Scroll inside it and try the categories and save buttons.",
    "app.near": "Your location", "app.search": "Search bakeries and products", "app.kicker": "Lucky bag",
    "app.heroTitle": "What's in the lucky bag?", "app.heroTag": "2–3× cheaper", "app.all": "See all",
    "tab.home": "Home", "tab.map": "Map", "tab.scan": "Scan", "tab.saved": "Saved", "tab.points": "Points",
    "empty.t": "No bags in this category right now", "empty.p": "Try another category.",
    "today": "Today", "tomorrow": "Tomorrow", "bag": "Lucky bag", "new": "New", "left": "left"
  };
  var MN = {
    "bags.more": "Бусад уутыг харах", "bags.less": "Цөөн харуулах",
    "empty.t": "Энэ ангилалд одоогоор уут алга", "empty.p": "Өөр ангилал сонгоно уу.",
    "today": "Өнөөдөр", "tomorrow": "Маргааш", "bag": "Азын уут", "new": "Шинэ", "left": "үлдсэн"
  };
  var DISTRICT_EN = { "Чингэлтэй": "Chingeltei", "Баянгол": "Bayangol", "Баянзүрх": "Bayanzürkh", "Сүхбаатар": "Sükhbaatar", "Хан-Уул": "Khan-Uul" };
  var originals = {};

  function t(key) { return lang === "en" ? (EN[key] || MN[key] || key) : (MN[key] || originals[key] || key); }
  function icon(name) { return '<svg class="icon" aria-hidden="true"><use href="' + SPRITE + name + '"/></svg>'; }
  function money(n) { return n.toLocaleString("en-US") + "₮"; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function district(d) { return lang === "en" ? (DISTRICT_EN[d] || d) : d; }
  function leftLabel(s) { return lang === "en" ? s.replace("мин", "min").replace("цаг", "hr") : s; }

  function renderBags() {
    var grid = document.getElementById("bag-grid");
    var more = document.getElementById("show-more");
    var items = filter === "all" ? D.endingSoon : D.endingSoon.filter(function (b) { return b.kind === filter; });
    if (!items.length) {
      grid.innerHTML = '<div class="empty"><strong>' + t("empty.t") + '</strong>' + t("empty.p") + "</div>";
      more.parentNode.hidden = true;
      return;
    }
    var shown = expanded ? items : items.slice(0, FIRST);
    grid.innerHTML = shown.map(function (b) {
      var off = Math.round((1 - b.now / b.was) * 100);
      var place = t("bag") + (b.district ? " · " + district(b.district) : "");
      return '<a class="bag" href="#">' +
        '<div class="bag-well"><img src="assets/photos/' + b.img + '.webp" alt="" loading="lazy" width="720" height="540">' +
          '<span class="save">−' + off + '%</span>' +
          '<span class="left">' + icon("clock") + esc(leftLabel(b.left)) + '</span></div>' +
        "<h3>" + esc(b.shop) + "</h3>" +
        '<div class="meta"><span>' + icon("marker") + esc(place) + "</span><span>" + icon("time-fast") + t("today") + " " + b.window + "</span></div>" +
        '<div class="price"><b>' + money(b.now) + "</b><s>" + money(b.was) + "</s></div></a>";
    }).join("");
    more.parentNode.hidden = items.length <= FIRST;
    more.textContent = expanded ? t("bags.less") : t("bags.more");
  }

  function renderTomorrow() {
    document.getElementById("tmr-list").innerHTML = D.tomorrow.map(function (b) {
      var sub = t("bag") + " · " + district(b.district) + " · " + t("tomorrow") + (b.window ? " " + b.window : "");
      return '<li class="row"><a href="#">' +
        '<span class="row-ic"><img src="assets/photos/' + b.img + '.webp" alt="" loading="lazy" width="720" height="540"></span>' +
        '<span><span class="row-name">' + esc(b.shop) + '</span><span class="new">' + t("new") + '</span><span class="row-sub" style="display:block">' + esc(sub) + "</span></span>" +
        '<span class="price"><b>' + money(b.now) + "</b><s>" + money(b.was) + "</s></span>" +
        '<span class="go">' + icon("arrow-small-right") + "</span></a></li>";
    }).join("");
  }

  function renderShops() {
    document.getElementById("shop-list").innerHTML = D.shops.map(function (s) {
      return '<a href="#"><span>' + esc(s.name) + "</span><span>" + esc(district(s.district)) + "</span></a>";
    }).join("");
  }

  /* ---------- App preview ---------- */
  var appFilter = "all";
  var savedBags = {};
  function renderApp() {
    var rail = document.getElementById("ph-rail");
    var items = appFilter === "all" ? D.endingSoon : D.endingSoon.filter(function (b) { return b.kind === appFilter; });
    rail.innerHTML = items.length ? items.map(function (b, i) {
      var off = Math.round((1 - b.now / b.was) * 100);
      var on = !!savedBags[b.listing];
      return '<article class="ph-card"><div class="ph-photo"><img src="assets/photos/' + b.img + '.webp" alt="" loading="lazy">' +
        '<span class="save">−' + off + '%</span>' +
        '<button class="ph-heart" type="button" data-save="' + b.listing + '" aria-pressed="' + on + '" aria-label="' + esc(b.shop) + '">' + icon("bookmark") + "</button>" +
        '<span class="ph-time">' + icon("clock") + esc(leftLabel(b.left)) + "</span></div>" +
        '<div class="ph-body"><b>' + esc(b.shop) + "</b><small>" + esc(t("bag") + (b.district ? " · " + district(b.district) : "") + " · " + b.window) + "</small>" +
        '<div class="ph-price"><span><strong>' + money(b.now) + "</strong><s>" + money(b.was) + '</s></span><button class="ph-add" type="button" aria-label="+">' + icon("shopping-bag") + "</button></div></div></article>";
    }).join("") : '<div class="ph-empty">' + t("empty.t") + "</div>";
    document.getElementById("ph-list").innerHTML = D.tomorrow.map(function (b) {
      return '<li><img src="assets/photos/' + b.img + '.webp" alt="" loading="lazy"><div><b>' + esc(b.shop) + "</b><small>" + esc(district(b.district) + " · " + t("tomorrow") + (b.window ? " " + b.window : "")) +
        '</small><span class="new">' + t("new") + "</span></div><strong>" + money(b.now) + "<s>" + money(b.was) + "</s></strong></li>";
    }).join("");
  }
  var dlg = document.getElementById("app-dialog");
  document.querySelectorAll("[data-app-open]").forEach(function (b) {
    b.addEventListener("click", function () {
      if (dlg.showModal) dlg.showModal(); else dlg.setAttribute("open", "");
      document.body.style.overflow = "hidden";
    });
  });
  function closeApp() { if (dlg.close) dlg.close(); else dlg.removeAttribute("open"); }
  dlg.addEventListener("close", function () { document.body.style.overflow = ""; });
  dlg.querySelectorAll("[data-app-close]").forEach(function (b) { b.addEventListener("click", closeApp); });
  dlg.addEventListener("click", function (e) { if (e.target === dlg || e.target.classList.contains("app-stage")) closeApp(); });
  document.getElementById("ph-chips").addEventListener("click", function (e) {
    var c = e.target.closest("button"); if (!c) return;
    appFilter = c.getAttribute("data-k");
    this.querySelectorAll("button").forEach(function (o) { o.setAttribute("aria-pressed", String(o === c)); });
    renderApp();
    document.getElementById("ph-rail").scrollLeft = 0;
  });
  document.getElementById("ph-rail").addEventListener("click", function (e) {
    var h = e.target.closest("[data-save]"); if (!h) return;
    var id = h.getAttribute("data-save"); savedBags[id] = !savedBags[id];
    h.setAttribute("aria-pressed", String(savedBags[id]));
  });
  dlg.querySelector(".ph-tabs").addEventListener("click", function (e) {
    var b = e.target.closest("button"); if (!b || b.classList.contains("ph-scan")) return;
    this.querySelectorAll("button").forEach(function (o) { o.removeAttribute("aria-current"); });
    b.setAttribute("aria-current", "page");
  });

  function applyLang() {
    document.documentElement.lang = lang === "en" ? "en" : "mn";
    document.querySelectorAll("[data-i18n],[data-i18n-html]").forEach(function (el) {
      var key = el.getAttribute("data-i18n") || el.getAttribute("data-i18n-html");
      var html = el.hasAttribute("data-i18n-html");
      if (!(key in originals)) originals[key] = html ? el.innerHTML : el.textContent;
      var val = lang === "en" ? (EN[key] || originals[key]) : originals[key];
      if (html) el.innerHTML = val; else el.textContent = val;
    });
    document.querySelectorAll("[data-i18n-ph]").forEach(function (el) {
      var key = el.getAttribute("data-i18n-ph");
      if (!(("ph:" + key) in originals)) originals["ph:" + key] = el.getAttribute("placeholder");
      el.setAttribute("placeholder", lang === "en" ? EN[key] : originals["ph:" + key]);
    });
    document.getElementById("lang-mn").setAttribute("aria-pressed", String(lang === "mn"));
    document.getElementById("lang-en").setAttribute("aria-pressed", String(lang === "en"));
    renderBags(); renderTomorrow(); renderShops(); renderApp(); if (themeBtn) themeLabel();
  }

  function setLang(l) {
    lang = l;
    try { localStorage.setItem("hairan-lang", l); } catch (e) {}
    applyLang();
  }

  // Demo build: links that would leave the page do nothing.
  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest('a[href="#"]');
    if (a) e.preventDefault();
  });

  document.querySelectorAll(".chip").forEach(function (c) {
    c.addEventListener("click", function () {
      filter = c.getAttribute("data-filter");
      // Demo build: links that would leave the page do nothing.
  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest('a[href="#"]');
    if (a) e.preventDefault();
  });

  document.querySelectorAll(".chip").forEach(function (o) { o.setAttribute("aria-pressed", String(o === c)); });
      renderBags();
    });
  });
  document.getElementById("show-more").addEventListener("click", function () { expanded = !expanded; renderBags(); });
  /* Dark / light switch. The initial theme is set by the inline script in <head>. */
  var themeBtn = document.getElementById("theme-btn");
  function themeLabel() {
    var dark = document.documentElement.getAttribute("data-theme") === "dark";
    themeBtn.setAttribute("aria-label", lang === "en" ? (dark ? "Light mode" : "Dark mode") : (dark ? "Гэрэлтэй горим" : "Харанхуй горим"));
    themeBtn.setAttribute("aria-pressed", String(dark));
  }
  themeBtn.addEventListener("click", function () {
    var next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try { localStorage.setItem("hairan-theme", next); } catch (e) {}
    themeLabel();
  });

  document.getElementById("lang-mn").addEventListener("click", function () { setLang("mn"); });
  document.getElementById("lang-en").addEventListener("click", function () { setLang("en"); });

  var menuBtn = document.getElementById("menu-btn"), menu = document.getElementById("mobile-nav");
  menuBtn.addEventListener("click", function () {
    var open = menu.getAttribute("data-open") !== "true";
    menu.setAttribute("data-open", String(open));
    menuBtn.setAttribute("aria-expanded", String(open));
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && menu.getAttribute("data-open") === "true") { menu.setAttribute("data-open", "false"); menuBtn.setAttribute("aria-expanded", "false"); menuBtn.focus(); }
  });

  try { var saved = localStorage.getItem("hairan-lang"); if (saved === "en") lang = "en"; } catch (e) {}
  applyLang();
})();
