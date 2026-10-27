(function () {
  "use strict";
  // ====== FOTOS: coloque os arquivos em photos/ e adicione aqui ======
  // Exemplo: { src: "photos/foto1.jpg", caption: "Legenda opcional" }
  var PHOTOS = [];

  var $ = function (id) { return document.getElementById(id); };
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ---------- Partículas ----------
  (function () {
    var c = $("particles"), ctx = c.getContext("2d"), w, h, dpr = Math.min(window.devicePixelRatio || 1, 2);
    function resize() { w = innerWidth; h = innerHeight; c.width = w * dpr; c.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); }
    resize(); addEventListener("resize", resize);
    var ps = []; for (var i = 0; i < 38; i++) ps.push({ x: Math.random() * w, y: Math.random() * h, r: Math.random() * 1.8 + .4, v: Math.random() * .25 + .05, p: Math.random() * 6.28 });
    function draw(t) {
      ctx.clearRect(0, 0, w, h);
      ps.forEach(function (p) {
        if (!reduce) { p.y -= p.v; if (p.y < -5) { p.y = h + 5; p.x = Math.random() * w; } }
        ctx.globalAlpha = .25 + .35 * Math.pow(Math.sin(t / 1200 + p.p), 2);
        ctx.fillStyle = "#F1B6CB"; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.28); ctx.fill();
      });
      // Continue the twinkle loop on mobile even when the OS requests reduced motion.
      // In reduced-motion mode, stars stay in place but still gently brighten/dim.
      requestAnimationFrame(draw);
    }
    requestAnimationFrame(draw);
  })();

  // ---------- Revelar ao rolar ----------
  var io = "IntersectionObserver" in window ? new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
  }, { threshold: .2 }) : null;
  function watch() { document.querySelectorAll(".reveal:not(.in)").forEach(function (el) { io ? io.observe(el) : el.classList.add("in"); }); }

  // ---------- Abertura ----------
  $("openBtn").addEventListener("click", function () {
    this.disabled = true;
    // Restart the burst animation reliably on mobile browsers.
    $("burst").classList.add("hidden");
    void $("burst").offsetWidth;
    $("burst").classList.remove("hidden");
    $("intro").classList.add("leaving");
    setTimeout(function () { $("intro").classList.add("hidden"); $("page").classList.remove("hidden"); scrollTo(0, 0); watch(); }, 1400);
  });

  // ---------- Música ----------
  var audio = new Audio("audio/nossa-musica.mp3");
  audio.preload = "metadata"; audio.volume = .8;
  var PLAY = '<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>';
  var PAUSE = '<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M7 5h4v14H7zM13 5h4v14h-4z"/></svg>';
  function fmt(s) { return isFinite(s) && s > 0 ? Math.floor(s / 60) + ":" + ("0" + Math.floor(s % 60)).slice(-2) : "0:00"; }
  function ui(playing) {
    $("playBtn").innerHTML = playing ? PAUSE : PLAY; $("dockIcon").innerHTML = playing ? PAUSE : PLAY;
    $("playBtn").setAttribute("aria-label", playing ? "Pausar" : "Tocar");
    $("disc").classList.toggle("spin", playing); $("dockDisc").classList.toggle("spin", playing);
    $("pTitle").textContent = playing ? "Tocando agora" : "Nossa música";
  }
  ui(false);
  function toggle() {
    if (audio.paused) {
      $("err").classList.add("hidden");
      var pr = audio.play();
      if (pr && pr.catch) pr.catch(function () { $("err").classList.remove("hidden"); });
    } else audio.pause();
  }
  audio.addEventListener("play", function () { ui(true); $("dock").classList.remove("hidden"); });
  audio.addEventListener("pause", function () { ui(false); });
  audio.addEventListener("ended", function () { ui(false); });
  audio.addEventListener("error", function () { $("err").classList.remove("hidden"); });
  audio.addEventListener("loadedmetadata", function () { $("seek").max = audio.duration; $("dur").textContent = fmt(audio.duration); });
  audio.addEventListener("timeupdate", function () {
    $("seek").value = audio.currentTime; $("cur").textContent = fmt(audio.currentTime);
    if (audio.duration) $("dockBar").style.width = (audio.currentTime / audio.duration * 100) + "%";
  });
  $("seek").addEventListener("input", function () { audio.currentTime = Number(this.value); });
  $("vol").addEventListener("input", function () { audio.volume = Number(this.value); });
  $("playBtn").addEventListener("click", toggle);
  $("dockBtn").addEventListener("click", toggle);
  $("musicBtn").addEventListener("click", function () { this.classList.add("hidden"); $("player").classList.remove("hidden"); toggle(); });

  // ---------- Cartões ----------
  document.querySelectorAll(".card > button").forEach(function (b) {
    b.addEventListener("click", function () {
      var card = b.parentNode, open = card.classList.toggle("open");
      b.setAttribute("aria-expanded", open); b.querySelector(".plus").textContent = open ? "–" : "+";
    });
  });

  // ---------- Galeria ----------
  if (PHOTOS.length) {
    $("fotos").classList.remove("hidden");
    PHOTOS.forEach(function (p) {
      var fig = document.createElement("figure"), b = document.createElement("button"), img = document.createElement("img");
      img.src = p.src; img.alt = p.caption || "Foto"; img.loading = "lazy"; b.setAttribute("aria-label", "Abrir foto"); b.appendChild(img); fig.appendChild(b);
      if (p.caption) { var f = document.createElement("figcaption"); f.textContent = p.caption; fig.appendChild(f); }
      b.addEventListener("click", function () { $("lbImg").src = p.src; $("lbImg").alt = img.alt; $("lightbox").classList.remove("hidden"); });
      $("gallery").appendChild(fig);
    });
  }
  function closeLb() { $("lightbox").classList.add("hidden"); }
  $("lbClose").addEventListener("click", closeLb); $("lightbox").addEventListener("click", function (e) { if (e.target === this) closeLb(); });

  // ---------- Final ----------
  $("keepBtn").addEventListener("click", function () { this.classList.add("hidden"); $("kept").classList.remove("hidden"); });
  $("backBtn").addEventListener("click", function () {
    $("page").classList.add("hidden"); $("intro").classList.remove("hidden", "leaving"); $("burst").classList.add("hidden");
    $("openBtn").disabled = false; $("kept").classList.add("hidden"); $("keepBtn").classList.remove("hidden"); scrollTo(0, 0);
  });
})();
