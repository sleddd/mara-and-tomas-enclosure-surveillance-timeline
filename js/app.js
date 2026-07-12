/* ============================================================
   Mara & Tomas — app wiring.

   Index-driven, not scroll-driven: one STOPS[] entry is "current"
   at a time. The background stage (ground/props/figures) is fixed
   to the viewport and swaps its contents when the current stop
   changes. The reader panel (text + ledger) is the one scrollable
   element, also fixed to the viewport, sitting above the stage.
   Moving between stops is explicit — Next/Previous buttons, arrow
   keys, or the minimap — there is no scroll-through-panels gesture
   to arbitrate, so touch and trackpad both behave simply: vertical
   scroll always means "read," nothing else.
   ============================================================ */

(function () {
  const stage = document.getElementById("stage");
  const propFar = document.getElementById("propFar");
  const propNear = document.getElementById("propNear");
  const groundEl = document.getElementById("ground");
  const finalQuestionEl = document.getElementById("finalQuestion");
  const figuresEl = document.getElementById("figures");
  const reader = document.getElementById("reader");
  const minimapEl = document.getElementById("minimap");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const stopPosEl = document.getElementById("stopPos");
  const progressEl = document.getElementById("progress");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const ERA_COUNT = STOPS.filter((s) => s.kind === "era").length;
  const idToIndex = new Map(STOPS.map((s, i) => [s.id, i]));

  /* ---------- ledger rendering (unchanged content, same markup) ---------- */

  function ledgerValue(val) {
    if (typeof val === "string") return `<p class="ledger-a">${val}</p>`;
    return `
      <p class="ledger-a split"><span class="who">his</span>${val.his}</p>
      <p class="ledger-a split"><span class="who">hers</span>${val.hers}</p>`;
  }

  function eraReaderHTML(s) {
    const act = ACTS[s.act];
    const isSplit = ["watches", "fenced", "theirs"].some((k) => typeof s.ledger[k] === "object");
    const rows = [
      ["watches", "Who watches them?", ""],
      ["fenced", "What is fenced?", "fenced"],
      ["theirs", "What is theirs?", ""]
    ].map(([key, label, cls]) => `
      <div class="ledger-row ${cls}">
        <h3 class="ledger-q">${label}</h3>
        ${ledgerValue(s.ledger[key])}
      </div>`).join("");

    const isFirstOfAct = s.num === Math.min(...STOPS
      .filter((x) => x.act === s.act && x.kind === "era")
      .map((x) => x.num));

    return `
      <div class="panel-content">
        <div class="panel-text">
          <div class="panel-act">Act ${act.numeral} — ${act.title} · Stop ${s.num} of ${ERA_COUNT}</div>
          ${isFirstOfAct ? `<p class="act-blurb">${act.blurb}</p>` : ""}
          <div class="panel-date">${s.dateLabel}</div>
          <h2 class="panel-title">${s.title}</h2>
          <p class="panel-vignette">${s.vignette}</p>
        </div>
        <div class="ledger" role="group" aria-label="The ledger at this stop">
          ${isSplit ? `<span class="split-mark">his · hers diverge</span>` : ""}
          <div class="ledger-caption">The ledger — the same three questions, asked at every stop on the walk</div>
          ${rows}
          ${s.herLine ? `<p class="her-line"><b>Her line —</b> ${s.herLine}</p>` : ""}
          ${s.anchors && s.anchors.length ? `
          <details class="sources">
            <summary>Sources</summary>
            <ul>${s.anchors.map((a) => `<li>${a}</li>`).join("")}</ul>
          </details>` : ""}
        </div>
      </div>`;
  }

  function corridorReaderHTML(s) {
    return `
      <div class="corridor-inner">
        <div class="corridor-kicker">Transition${s.dateLabel ? " · " + s.dateLabel : ""}</div>
        <h2 class="corridor-title">${s.title}</h2>
        <p class="corridor-mechanism">${s.mechanism}</p>
      </div>`;
  }

  /* ---------- minimap ---------- */

  const byAct = {};
  STOPS.filter((s) => s.kind === "era").forEach((s) => {
    (byAct[s.act] = byAct[s.act] || []).push(s);
  });

  minimapEl.innerHTML =
    `<span class="mm-band-legend"><i></i>what is theirs, substantive</span>` +
    Object.keys(byAct).map((a) => `
      <div class="mm-act">
        <div class="mm-ticks">
          ${byAct[a].map((s) => `
            <button class="mm-tick ${THEIRS_SUBSTANTIVE.includes(s.num) ? "theirs" : ""}"
                    data-target="${s.id}" title="${s.num}. ${s.title}"
                    aria-label="Go to stop ${s.num}: ${s.title}"></button>`).join("")}
        </div>
        <div class="mm-label">${ACTS[a].numeral} · ${ACTS[a].title}</div>
      </div>`).join("");

  minimapEl.addEventListener("click", (e) => {
    const btn = e.target.closest(".mm-tick");
    if (btn) goToId(btn.dataset.target, true);
  });

  /* ---------- current-stop state ---------- */

  let current = 0;
  let currentCostume = null;
  let walkTimer = null;

  function renderStage(s) {
    const act = ACTS[s.act];
    const prop = PROPS[s.id] || { far: "", near: "" };

    propFar.innerHTML = `<svg viewBox="0 0 400 260" preserveAspectRatio="xMidYMax meet">${prop.far || ""}</svg>`;
    propNear.innerHTML = prop.near
      ? `<svg viewBox="0 0 400 260" preserveAspectRatio="xMidYMax meet" role="img" aria-label="${s.propAlt || ""}">${prop.near}</svg>`
      : "";

    if (s.blend) {
      groundEl.className = "ground blend";
      groundEl.innerHTML = `<div class="g-a ${s.blend[0]}"></div><div class="g-b ${s.blend[1]}"></div>`;
    } else {
      const groundClass = s.kind === "era" ? act.ground : ACTS[s.act].ground;
      groundEl.className = `ground ${groundClass}`;
      groundEl.innerHTML = "";
    }

    stage.classList.toggle("final", !!s.final);
    finalQuestionEl.hidden = !s.final;

    document.body.classList.toggle("doubles-active", !!s.doubles);

    const costume = s.costume || currentCostume;
    if (costume && costume !== currentCostume) {
      currentCostume = costume;
      Figures.dress(costume);
    }
  }

  function renderReader(s) {
    reader.innerHTML = s.kind === "era" ? eraReaderHTML(s) : corridorReaderHTML(s);
    reader.scrollTop = 0;
    stage.classList.remove("scrolled-deep");
    reader.dataset.kind = s.kind;
  }

  function updateChrome(s, index) {
    history.replaceState(null, "", "#" + s.id);
    minimapEl.querySelectorAll(".mm-tick").forEach((t) =>
      t.dataset.target === s.id ? t.setAttribute("aria-current", "true") : t.removeAttribute("aria-current"));

    prevBtn.disabled = index === 0;
    nextBtn.disabled = index === STOPS.length - 1;
    const eraNum = s.kind === "era" ? s.num : null;
    stopPosEl.textContent = eraNum ? `Stop ${eraNum} of ${ERA_COUNT}` : "Transition";
    progressEl.style.width = `${(index / (STOPS.length - 1)) * 100}%`;
  }

  function playWalkBurst() {
    if (reduceMotion) { Figures.pose(0, 0); return; }
    cancelAnimationFrame(walkTimer);
    const start = performance.now();
    const duration = 520;
    function step(now) {
      const t = Math.min(1, (now - start) / duration);
      const amp = Math.sin(t * Math.PI); // ramps up then back down to 0
      Figures.pose(t * 6, amp);
      if (t < 1) {
        walkTimer = requestAnimationFrame(step);
      } else {
        Figures.pose(0, 0);
      }
    }
    walkTimer = requestAnimationFrame(step);
  }

  function goTo(index, { animate = true, focusReader = false } = {}) {
    index = Math.max(0, Math.min(STOPS.length - 1, index));
    const s = STOPS[index];
    current = index;
    renderStage(s);
    renderReader(s);
    updateChrome(s, index);
    if (animate) playWalkBurst();
    if (focusReader) reader.focus({ preventScroll: true });
  }

  function goToId(id, animate) {
    const idx = idToIndex.get(id);
    if (idx !== undefined) goTo(idx, { animate });
  }

  /* ---------- nav controls ---------- */

  prevBtn.addEventListener("click", () => goTo(current - 1, { focusReader: true }));
  nextBtn.addEventListener("click", () => goTo(current + 1, { focusReader: true }));

  window.addEventListener("keydown", (e) => {
    if (e.altKey || e.metaKey || e.ctrlKey) return;
    const tag = document.activeElement && document.activeElement.tagName;
    if (tag === "INPUT" || tag === "TEXTAREA") return;
    if (e.key === "ArrowRight") { e.preventDefault(); goTo(current + 1); }
    else if (e.key === "ArrowLeft") { e.preventDefault(); goTo(current - 1); }
    else if (e.key === "Home") { e.preventDefault(); goTo(0); }
    else if (e.key === "End") { e.preventDefault(); goTo(STOPS.length - 1); }
  });

  /* ---------- reader scroll: blur the background once the reader
     has scrolled down roughly a screen's worth into a long stop.
     At rest (top of any stop) the background stays sharp. ---------- */

  const BLUR_THRESHOLD = 120;
  reader.addEventListener("scroll", () => {
    stage.classList.toggle("scrolled-deep", reader.scrollTop > BLUR_THRESHOLD);
  }, { passive: true });

  /* ---------- deep links ---------- */

  window.addEventListener("hashchange", () => goToId(location.hash.slice(1), false));

  /* ---------- theme ---------- */

  const themeBtn = document.getElementById("themeToggle");
  function setTheme(dark) {
    document.documentElement.dataset.theme = dark ? "dark" : "light";
    themeBtn.setAttribute("aria-pressed", String(dark));
    themeBtn.querySelector(".tool-label").textContent = dark ? "Light" : "Dark";
    try { localStorage.setItem("mt-theme", dark ? "dark" : "light"); } catch (_) {}
  }
  themeBtn.addEventListener("click", () =>
    setTheme(document.documentElement.dataset.theme !== "dark"));
  try {
    if (localStorage.getItem("mt-theme") === "dark") setTheme(true);
  } catch (_) {}

  /* ---------- figures ---------- */

  const figScale = window.innerWidth < 900 ? 0.68 : Math.min(0.95, window.innerHeight / 780);
  Figures.mount(figuresEl, figScale);

  let resizeTimer = null;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      const s = window.innerWidth < 900 ? 0.68 : Math.min(0.95, window.innerHeight / 780);
      figuresEl.innerHTML = "";
      Figures.mount(figuresEl, s);
      if (currentCostume) Figures.dress(currentCostume);
      Figures.pose(0, 0);
    }, 180);
  });

  /* ---------- go ---------- */

  const startId = location.hash.slice(1);
  const startIndex = idToIndex.has(startId) ? idToIndex.get(startId) : 0;
  goTo(startIndex, { animate: false });
})();
