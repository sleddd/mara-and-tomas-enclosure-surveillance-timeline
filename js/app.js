/* ============================================================
   Mara & Tomas — app wiring.
   Renders panels from STOPS, drives the walk from scroll,
   parallax on prop layers, minimap, keyboard, deep links.
   ============================================================ */

(function () {
  const scroller = document.getElementById("scroller");
  const minimapEl = document.getElementById("minimap");
  const figuresEl = document.getElementById("figures");
  const hintEl = document.getElementById("hint");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const ERA_COUNT = STOPS.filter((s) => s.kind === "era").length;

  /* ---------- render panels ---------- */

  function ledgerValue(val) {
    if (typeof val === "string") return `<p class="ledger-a">${val}</p>`;
    return `
      <p class="ledger-a split"><span class="who">his</span>${val.his}</p>
      <p class="ledger-a split"><span class="who">hers</span>${val.hers}</p>`;
  }

  function eraPanel(s) {
    const act = ACTS[s.act];
    const isSplit = ["watches", "fenced", "theirs"].some((k) => typeof s.ledger[k] === "object");
    const prop = PROPS[s.id] || { far: "", near: "" };
    const rows = [
      ["watches", "Who watches them?", ""],
      ["fenced", "What is fenced?", "fenced"],
      ["theirs", "What is theirs?", ""]
    ].map(([key, label, cls]) => `
      <div class="ledger-row ${cls}">
        <h3 class="ledger-q">${label}</h3>
        ${ledgerValue(s.ledger[key])}
      </div>`).join("");

    return `
    <section class="panel era ${s.final ? "final" : ""}" id="${s.id}"
             data-kind="era" data-num="${s.num}" data-act="${s.act}"
             data-costume="${s.costume}" ${s.doubles ? 'data-doubles="1"' : ""}
             aria-label="Stop ${s.num} of ${ERA_COUNT}: ${s.title}">
      <div class="panel-text">
        <div class="panel-act">Act ${act.numeral} — ${act.title} · Stop ${s.num} of ${ERA_COUNT}</div>
        ${s.num === Math.min(...STOPS.filter((x) => x.act === s.act && x.kind === "era").map((x) => x.num))
          ? `<p class="act-blurb">${act.blurb}</p>` : ""}
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
      <div class="prop-layer far" aria-hidden="true">
        <svg viewBox="0 0 400 260" preserveAspectRatio="xMidYMax meet">${prop.far}</svg>
      </div>
      <div class="prop-layer near">
        <svg viewBox="0 0 400 260" preserveAspectRatio="xMidYMax meet" role="img"
             aria-label="${s.propAlt || ""}">${prop.near}</svg>
      </div>
      ${s.final ? `<p class="final-question" aria-hidden="true">no ground line ahead of them</p>` : ""}
      <div class="ground ${act.ground}"></div>
    </section>`;
  }

  function corridorPanel(s) {
    const ground = s.blend
      ? `<div class="ground blend" aria-hidden="true">
           <div class="g-a ${s.blend[0]}"></div>
           <div class="g-b ${s.blend[1]}"></div>
         </div>`
      : `<div class="ground ${ACTS[s.act].ground}"></div>`;
    return `
    <section class="panel corridor" id="${s.id}" data-kind="transition" data-act="${s.act}"
             aria-label="Transition: ${s.title}">
      <div class="corridor-rails" aria-hidden="true"></div>
      <div class="corridor-inner">
        <div class="corridor-kicker">Transition${s.dateLabel ? " · " + s.dateLabel : ""}</div>
        <h2 class="corridor-title">${s.title}</h2>
        <p class="corridor-mechanism">${s.mechanism}</p>
      </div>
      ${ground}
    </section>`;
  }

  scroller.innerHTML = STOPS.map((s) => (s.kind === "era" ? eraPanel(s) : corridorPanel(s))).join("");
  const panels = Array.from(scroller.querySelectorAll(".panel"));

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
    if (btn) scrollToPanel(document.getElementById(btn.dataset.target));
  });

  const progress = document.createElement("div");
  progress.className = "progress";
  document.body.appendChild(progress);

  /* ---------- figures ---------- */

  const figScale = window.innerWidth < 900 ? 0.6 : Math.min(0.95, window.innerHeight / 780);
  Figures.mount(figuresEl, figScale);
  Figures.dress(STOPS[0].costume);
  Figures.pose(0, 0);

  /* ---------- geometry cache ---------- */

  let geo = [];
  function cacheGeometry() {
    geo = panels.map((p) => ({
      el: p,
      left: p.offsetLeft,
      width: p.offsetWidth,
      kind: p.dataset.kind,
      far: p.querySelector(".prop-layer.far"),
      near: p.querySelector(".prop-layer.near")
    }));
  }
  cacheGeometry();

  /* ---------- scroll → walk ---------- */

  let lastScroll = scroller.scrollLeft;
  let phase = 0, amp = 0, lastMove = 0;
  let currentEraId = null, currentCostume = STOPS[0].costume;
  let swapTimer = null;

  function anchorX() {
    // the point of the timeline the couple is standing on
    return scroller.scrollLeft + window.innerWidth * 0.15 + 130 * figScale;
  }

  function panelAt(x) {
    for (const g of geo) if (x >= g.left && x < g.left + g.width) return g;
    return geo[geo.length - 1];
  }

  function setActiveEra(g) {
    const id = g.el.id;
    if (id === currentEraId) return;
    currentEraId = id;

    panels.forEach((p) => p.removeAttribute("aria-current"));
    g.el.setAttribute("aria-current", "true");
    minimapEl.querySelectorAll(".mm-tick").forEach((t) =>
      t.dataset.target === id ? t.setAttribute("aria-current", "true") : t.removeAttribute("aria-current"));

    history.replaceState(null, "", "#" + id);
    document.body.classList.toggle("doubles-active", !!g.el.dataset.doubles);

    const costume = g.el.dataset.costume;
    if (costume && costume !== currentCostume) {
      currentCostume = costume;
      if (reduceMotion) {
        Figures.dress(costume);
      } else {
        clearTimeout(swapTimer);
        figuresEl.classList.add("swapping");
        swapTimer = setTimeout(() => {
          Figures.dress(costume);
          figuresEl.classList.remove("swapping");
        }, 220);
      }
    }
  }

  function applyParallax() {
    if (reduceMotion) return;
    const center = scroller.scrollLeft + window.innerWidth / 2;
    const vw = window.innerWidth;
    for (const g of geo) {
      if (!g.far && !g.near) continue;
      const dist = g.left + g.width / 2 - center;
      if (Math.abs(dist) > vw * 1.2) continue;
      if (g.far) g.far.style.transform = `translateX(${(-0.6 * dist).toFixed(1)}px)`;
      if (g.near) g.near.style.transform = `translateX(${(-0.2 * dist).toFixed(1)}px)`;
    }
  }

  function frame(now) {
    const x = scroller.scrollLeft;
    const v = x - lastScroll;
    lastScroll = x;

    const active = panelAt(anchorX());
    if (active.kind === "era") setActiveEra(active);
    const cadence = active.kind === "transition" ? 1.6 : 1;

    if (!reduceMotion) {
      if (v !== 0) {
        phase += v * 0.05 * cadence;
        lastMove = now;
      }
      const target = now - lastMove < 140 ? 1 : 0;
      amp += (target - amp) * 0.12;
      if (amp < 0.015) amp = 0;
      Figures.pose(phase, amp);
      applyParallax();
    }

    // progress + hint
    const max = scroller.scrollWidth - scroller.clientWidth;
    progress.style.width = (max ? (x / max) * 100 : 0) + "%";
    if (x > 80) hintEl.classList.add("gone");

    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  /* ---------- wheel: vertical intent becomes horizontal travel,
     unless the pointer is over a panel's own scrollable text/ledger
     column that still has room left to scroll — then let that
     column absorb the gesture first (trackpad/touch/wheel alike) ---------- */

  function scrollableAncestor(node) {
    while (node && node !== scroller) {
      if (node.classList && (node.classList.contains("panel-text") ||
                              node.classList.contains("ledger") ||
                              node.classList.contains("corridor-inner"))) {
        return node;
      }
      node = node.parentElement;
    }
    return null;
  }

  scroller.addEventListener("wheel", (e) => {
    if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;

    const inner = scrollableAncestor(e.target);
    if (inner) {
      const atTop = e.deltaY < 0 && inner.scrollTop <= 0;
      const atBottom = e.deltaY > 0 && inner.scrollTop + inner.clientHeight >= inner.scrollHeight - 1;
      if (!atTop && !atBottom) return; // let the column scroll natively
    }

    scroller.scrollLeft += e.deltaY;
    e.preventDefault();
  }, { passive: false });

  /* ---------- keyboard ---------- */

  function scrollToPanel(el, smooth = !reduceMotion) {
    const left = el.offsetLeft + el.offsetWidth / 2 - window.innerWidth / 2;
    scroller.scrollTo({ left, behavior: smooth ? "smooth" : "auto" });
  }

  window.addEventListener("keydown", (e) => {
    if (e.altKey || e.metaKey || e.ctrlKey) return;
    if (["ArrowRight", "ArrowLeft", "Home", "End"].indexOf(e.key) === -1) return;
    e.preventDefault();
    const x = anchorX();
    let idx = geo.indexOf(panelAt(x));
    if (e.key === "ArrowRight") idx = Math.min(idx + 1, geo.length - 1);
    if (e.key === "ArrowLeft") idx = Math.max(idx - 1, 0);
    if (e.key === "Home") idx = 0;
    if (e.key === "End") idx = geo.length - 1;
    scrollToPanel(geo[idx].el);
  });

  /* ---------- deep links ---------- */

  function jumpToHash(smooth) {
    const id = location.hash.slice(1);
    if (!id) return;
    const el = document.getElementById(id);
    if (el && el.classList.contains("panel")) scrollToPanel(el, smooth);
  }
  window.addEventListener("hashchange", () => jumpToHash(true));

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

  /* ---------- resize ---------- */

  let resizeTimer = null;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      cacheGeometry();
      const s = window.innerWidth < 900 ? 0.6 : Math.min(0.95, window.innerHeight / 780);
      figuresEl.innerHTML = "";
      Figures.mount(figuresEl, s);
      Figures.dress(currentCostume);
      Figures.pose(phase, 0);
    }, 180);
  });

  /* ---------- go ---------- */

  scroller.focus({ preventScroll: true });
  requestAnimationFrame(() => jumpToHash(false));
})();
