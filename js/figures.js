/* ============================================================
   Mara & Tomas — cardboard paperdoll figures.
   One articulated rig (head / torso / two arms / two legs /
   optional skirt), dressed from a costume config per era.
   Limbs pivot at shoulder and hip; the walk is driven from
   app.js by setPhase(phase, amplitude).

   Figure coordinate space: viewBox 0 0 120 235
     head centre (60,26) r12.5 · shoulders y54 · hips y118
     feet on the ground line at y222
   ============================================================ */

(function () {

  const SKIN_T = "#B98A63", SKIN_M = "#C69976";
  const HAIR = "#3A3230";
  const SHOE = "#2E2C29";

  /* ---------- slot builders (local limb coords, pivot at 0,0) ---------- */

  function armSVG(c) {
    const skin = c.skin;
    const base = `M-4.5,-3 C-6.5,14 -6,34 -3.5,56 L3.5,56 C6.5,34 6.5,14 4.5,-3 Z`;
    let out = `<path d="${base}" fill="${skin}"/>`;
    if (c.sleeve === "long") {
      out = `<path d="M-4.5,-3 C-6.5,14 -6,34 -3.8,52 L3.8,52 C6.5,34 6.5,14 4.5,-3 Z" fill="${c.sleeveColor}"/>
             <path d="M-3.8,50 L-3.5,56 L3.5,56 L3.8,50 Z" fill="${skin}"/>`;
    } else if (c.sleeve === "short") {
      out += `<path d="M-5,-3 C-6.8,8 -6.6,16 -5.6,24 L5.6,24 C6.8,16 6.9,8 5,-3 Z" fill="${c.sleeveColor}"/>`;
    }
    out += `<circle cx="0.5" cy="61" r="5" fill="${skin}"/>`;
    if (c.accessory === "spear") {
      out = `<g>
        <rect x="2.2" y="-34" width="2.8" height="140" rx="1.2" fill="#6B4A2F"/>
        <path d="M0.5,-34 L3.6,-50 L6.7,-34 Z" fill="${SHOE}"/>
      </g>` + out;
    }
    return out;
  }

  function legSVG(c) {
    const skin = c.skin;
    const shape = (col, toY = 92) =>
      `<path d="M-6,0 L-4.5,50 L-3.6,${toY} L3.6,${toY} L4.5,50 L6,0 Z" fill="${col}"/>`;
    let out = "";
    if (c.legs === "bare") {
      out = shape(skin) + `<path d="M-3.8,90 L9,98 L9,102 L-4.2,102 L-4.2,92 Z" fill="${skin}"/>`;
    } else if (c.legs === "pants") {
      out = shape(c.legColor, 96) + `<path d="M-3.8,94 L9.5,98 L9.5,102 L-4.2,102 Z" fill="${c.shoe || SHOE}"/>`;
    } else if (c.legs === "hose") {
      out = shape(c.legColor) + `<path d="M-3.8,90 L9.5,97 L9.5,102 L-4.2,102 Z" fill="${c.shoe || SHOE}"/>`;
    } else if (c.legs === "breeches") {
      out = `<path d="M-6,0 L-5,32 L-4.6,52 L4.6,52 L5,32 L6,0 Z" fill="${c.legColor}"/>` +
            `<path d="M-4.4,50 L-3.6,92 L3.6,92 L4.4,50 Z" fill="${c.stocking}"/>` +
            `<path d="M-3.8,90 L9.5,97 L9.5,102 L-4.2,102 Z" fill="${c.shoe || SHOE}"/>`;
    } else if (c.legs === "sneaker") {
      out = shape(c.legColor, 94) +
            `<path d="M-4,92 L9.5,97 L9.5,102 L-4.4,102 Z" fill="#D8D2C2"/>` +
            `<rect x="-4.4" y="100" width="13.9" height="2" fill="${SHOE}"/>`;
    }
    return out;
  }

  function torsoSVG(c) {
    const skin = c.skin;
    let out = `<path d="M56,36 h8 v12 h-8 Z" fill="${skin}"/>`; // neck
    const t = c.torso;
    const tunic = (col, hem, flare = 3) =>
      `<path d="M49.5,47 Q60,41 70.5,47 L${74 + flare},${hem} L${46 - flare},${hem} Z" fill="${col}"/>`;
    if (t.type === "bare") {
      out += `<path d="M50,47 Q60,42 70,47 L73,118 Q60,124 47,118 Z" fill="${skin}"/>`;
    } else if (t.type === "tunic") {
      out += tunic(t.color, t.hem);
      if (t.belt) out += `<rect x="47.5" y="106" width="25" height="4.5" fill="${t.belt}"/>`;
      if (t.hemStripe) {
        out += `<path d="M${46 - 3},${t.hem} L${74 + 3},${t.hem} L${73.6 + 3},${t.hem - 6} L${46.4 - 3},${t.hem - 6} Z" fill="${t.hemStripe}"/>`;
      }
    } else if (t.type === "coat") {
      out += tunic(t.color, t.hem, 4);
      out += `<rect x="59.2" y="50" width="1.6" height="${t.hem - 54}" fill="rgba(0,0,0,0.28)"/>`;
      if (t.collar) out += `<path d="M53,46 L60,58 L67,46 L69,50 L60,63 L51,50 Z" fill="${t.collar}"/>`;
    } else if (t.type === "vest") {
      // shirt body + waistcoat
      out += tunic(t.shirt, 120, 2);
      out += `<path d="M51.5,49 Q60,44.5 68.5,49 L71,112 L49,112 Z" fill="${t.color}"/>
              <rect x="59.3" y="52" width="1.4" height="58" fill="rgba(0,0,0,0.3)"/>`;
    } else if (t.type === "dress") {
      out += `<path d="M50,47 Q60,41.5 70,47 L72.5,114 L47.5,114 Z" fill="${t.color}"/>`;
      if (t.collar) out += `<path d="M54,45.5 L60,55 L66,45.5 L67.5,49 L60,60 L52.5,49 Z" fill="${t.collar}"/>`;
      if (t.shawl) out += `<path d="M52,46 L74,110 L66,112 L48,54 Z" fill="${t.shawl}" opacity="0.9"/>`;
    }
    if (c.accessory === "bag") {
      out += `<path d="M52,50 L71,96 L67.5,98 L49,53 Z" fill="#6B4A2F"/>
              <path d="M62,96 C58,96 56,100 56,106 C56,113 62,116 67,116 C73,116 76,112 76,105 C76,99 72,96 68,96 Z" fill="#7C5A3B"/>`;
    }
    return out;
  }

  function skirtSVG(c) {
    if (!c.skirt) return "";
    const s = c.skirt;
    const drop = s.hem - 112;                  // pivot sits at (60,112)
    const w = s.flare || (15 + drop * 0.3);
    let out = `<path d="M-14,-3 Q0,-7 14,-3 L${w},${drop} Q0,${drop + 6} ${-w},${drop} Z" fill="${s.color}"/>`;
    if (s.fringe) {
      let f = "";
      for (let x = -w + 3; x < w; x += 5) f += `M${x},${drop} l1,6 l2,-6 `;
      out += `<path d="${f}" fill="${s.color}"/>`;
    }
    if (s.apron) {
      const aw = w * 0.55, ah = drop * 0.92;
      out += `<path d="M-8,-1 Q0,-4 8,-1 L${aw},${ah} Q0,${ah + 4} ${-aw},${ah} Z" fill="${s.apron}"/>`;
    }
    return out;
  }

  function headSVG(c) {
    const skin = c.skin, h = c.head || {};
    const hairCol = h.hairColor || HAIR;
    let back = "", front = "";

    // headwear drawn behind the face
    if (h.hat === "hood")  back += `<circle cx="59" cy="24" r="14.6" fill="${h.hatColor}"/><path d="M47,30 L44,50 L76,50 L73,30 Z" fill="${h.hatColor}"/>`;
    if (h.hat === "coif")  back += `<circle cx="59" cy="25" r="13.6" fill="${h.hatColor || "#EDE7D8"}"/><path d="M49,30 L48,44 L72,44 L71,30 Z" fill="${h.hatColor || "#EDE7D8"}"/>`;
    if (h.hat === "veil")  back += `<circle cx="59" cy="24" r="14.4" fill="#EDE7D8"/><path d="M46,26 L44,58 L58,58 L56,32 Z" fill="#EDE7D8"/>`;
    if (h.hair === "long") back += `<path d="M48.5,20 C45,34 46,50 43.5,58 L53,58 C51.5,46 51,34 52.5,26 Z" fill="${hairCol}"/>`;
    if (h.hair === "ponytail") back += `<path d="M48,18 C42,26 43,42 40,52 L46,53 C46.5,42 47.5,30 51,22 Z" fill="${hairCol}"/>`;
    if (h.hair === "braid") back += `<path d="M48.5,20 C46,32 47,46 45,56 L50.5,56 C50,44 50.5,32 52.5,25 Z" fill="${hairCol}"/><circle cx="47.5" cy="58.5" r="2.6" fill="${hairCol}"/>`;

    // face
    let out = back + `<circle cx="60" cy="26" r="12.5" fill="${skin}"/>`;

    // hair over the face
    if (h.hair === "short" || h.hair === "long" || h.hair === "ponytail" || h.hair === "braid")
      front += `<path d="M47.5,25 C47.5,17 52,13.5 60,13.5 C67,13.5 71.5,17.5 72,23 C66,18 53,18.5 47.5,25 Z" fill="${hairCol}"/>`;
    if (h.hair === "bun")
      front += `<path d="M47.5,25 C47.5,17 52,13.5 60,13.5 C67,13.5 71.5,17.5 72,23 C66,18 53,18.5 47.5,25 Z" fill="${hairCol}"/><circle cx="46.5" cy="19.5" r="5" fill="${hairCol}"/>`;
    if (h.hair === "updo")
      front += `<path d="M46.5,25 C45.5,14 52,10.5 60,10.5 C68,10.5 73,15 72.5,23 C66,15.5 52,16 46.5,25 Z" fill="${hairCol}"/><circle cx="57" cy="10.5" r="4.4" fill="${hairCol}"/>`;
    if (h.hair === "curls")
      front += `<path d="M47.5,25 C47.5,16 52,12.5 60,12.5 C67.5,12.5 72,17 72,23 C66,17.5 53,18 47.5,25 Z" fill="${hairCol}"/><circle cx="47.5" cy="27" r="4" fill="${hairCol}"/><circle cx="46.8" cy="20" r="3.6" fill="${hairCol}"/>`;

    if (c.beard)
      front += `<path d="M49,28 C49,39 54,44.5 60,44.5 C66,44.5 71,39 71,28 C67.5,34.5 52.5,34.5 49,28 Z" fill="${hairCol}"/>`;

    // headwear drawn over the hair
    if (h.hat === "headwrap") front += `<path d="M47,22 C48,14.5 53,11.5 60,11.5 C67,11.5 72,15 73,22 L73,17.5 C71,10.5 66,7.5 60,7.5 C53,7.5 48.5,11 47,17.5 Z" fill="${h.hatColor}"/><rect x="47" y="17.5" width="26" height="5" rx="2.5" fill="${h.hatColor}"/>`;
    if (h.hat === "flatcap") front += `<ellipse cx="57" cy="15" rx="11.5" ry="5.2" fill="${h.hatColor}"/><rect x="59" y="16.4" width="14" height="2.6" rx="1.3" fill="${h.hatColor}"/>`;
    if (h.hat === "bowler") front += `<path d="M50.5,17.5 C50.5,9.5 69.5,9.5 69.5,17.5 Z" fill="${h.hatColor}"/><ellipse cx="60" cy="17.5" rx="14" ry="3" fill="${h.hatColor}"/>`;
    if (h.hat === "tallhat") front += `<rect x="45.5" y="13" width="29" height="3.4" rx="1.6" fill="${h.hatColor}"/><path d="M51,13 L52.6,-7 L67.4,-7 L69,13 Z" fill="${h.hatColor}"/><rect x="51.6" y="7.5" width="16.8" height="3.4" fill="#5C5A54"/>`;
    if (h.hat === "mobcap") front += `<ellipse cx="58" cy="16.5" rx="12.6" ry="8.6" fill="#EDE7D8"/><path d="M46,19 Q58,24.5 70.5,19" stroke="#C9BFA8" stroke-width="1.6" fill="none"/>`;
    if (h.hat === "coif") front += `<path d="M47,25 C47,15.5 52.5,12 59.5,12 C66.5,12 71.5,16 72,24 L69,24 C68,18 64,15 59.5,15 C54,15 50,18.5 50,25 Z" fill="${h.hatColor || "#EDE7D8"}"/>`;
    if (h.hat === "veil") front += `<path d="M46.5,24 C46.5,14 52.5,10.5 60,10.5 C67.5,10.5 73,15 73,24 L70,22 C69,16 65,13.5 60,13.5 C54.5,13.5 50,17 49.5,24 Z" fill="#EDE7D8"/>`;
    if (h.hat === "hood") front += `<path d="M46,26 C45,14 52,9.5 60,9.5 C68,9.5 73.5,14.5 73.5,24 L70.5,22.5 C69.5,15.5 65,12.5 60,12.5 C54,12.5 49.5,16.5 49,26 Z" fill="${h.hatColor}"/>`;

    return out + front;
  }

  /* ---------- costume wardrobe ---------- */

  function W(tomas, mara) { return { tomas, mara }; }

  const COSTUMES = {
    forager: W(
      { skin: SKIN_T, sleeve: "none", accessory: "spear",
        torso: { type: "tunic", color: "#8A6A4F", hem: 112 },
        legs: "bare", head: { hair: "short" }, beard: true },
      { skin: SKIN_M, sleeve: "none", accessory: "bag",
        torso: { type: "dress", color: "#977257" },
        skirt: { hem: 172, color: "#977257" },
        legs: "bare", head: { hair: "long" } }
    ),
    neolithic: W(
      { skin: SKIN_T, sleeve: "none",
        torso: { type: "tunic", color: "#B3A284", hem: 144, belt: "#6B4A2F" },
        legs: "bare", head: { hair: "short" }, beard: true },
      { skin: SKIN_M, sleeve: "short", sleeveColor: "#A89478",
        torso: { type: "dress", color: "#A89478" },
        skirt: { hem: 204, color: "#A89478" },
        legs: "bare", head: { hair: "braid" } }
    ),
    bronze: W(
      { skin: SKIN_T, sleeve: "none",
        torso: { type: "bare" },
        skirt: { hem: 170, color: "#E4DAC0", fringe: true },
        legs: "bare", head: { hair: "short", hat: "headwrap", hatColor: "#A9744F" }, beard: true },
      { skin: SKIN_M, sleeve: "none",
        torso: { type: "dress", color: "#D9CDAE", shawl: "#A9744F" },
        skirt: { hem: 206, color: "#D9CDAE" },
        legs: "bare", head: { hair: "long", hat: "headwrap", hatColor: "#8A5C3F" } }
    ),
    classical: W(
      { skin: SKIN_T, sleeve: "none",
        torso: { type: "tunic", color: "#E8E0CB", hem: 166, hemStripe: "#2B3A67" },
        legs: "bare", head: { hair: "short" } },
      { skin: SKIN_M, sleeve: "short", sleeveColor: "#C29372",
        torso: { type: "dress", color: "#C29372" },
        skirt: { hem: 208, color: "#C29372" },
        legs: "bare", head: { hair: "updo" } }
    ),
    medieval: W(
      { skin: SKIN_T, sleeve: "long", sleeveColor: "#5B6B8C",
        torso: { type: "tunic", color: "#5B6B8C", hem: 152, belt: "#4A3826" },
        legs: "hose", legColor: "#5C5A54", head: { hair: "short", hat: "hood", hatColor: "#8A5C3F" }, beard: true },
      { skin: SKIN_M, sleeve: "long", sleeveColor: "#8A4F3D",
        torso: { type: "dress", color: "#8A4F3D" },
        skirt: { hem: 210, color: "#8A4F3D" },
        legs: "hose", legColor: "#8A4F3D", head: { hair: "long", hat: "veil" } }
    ),
    colonial: W(
      { skin: SKIN_T, sleeve: "long", sleeveColor: "#2E2C2A",
        torso: { type: "coat", color: "#2E2C2A", hem: 148, collar: "#EDE7D8" },
        legs: "breeches", legColor: "#2E2C2A", stocking: "#D8D2C2",
        head: { hair: "short", hat: "tallhat", hatColor: "#232220" } },
      { skin: SKIN_M, sleeve: "long", sleeveColor: "#41453E",
        torso: { type: "dress", color: "#41453E", collar: "#EDE7D8" },
        skirt: { hem: 212, color: "#41453E", apron: "#EDE7D8" },
        legs: "hose", legColor: "#41453E", head: { hair: "bun", hat: "coif" } }
    ),
    cottage: W(
      { skin: SKIN_T, sleeve: "long", sleeveColor: "#E8E0CB",
        torso: { type: "vest", color: "#2B3A67", shirt: "#E8E0CB" },
        legs: "breeches", legColor: "#6B5136", stocking: "#E3DCC8",
        head: { hair: "ponytail" } },
      { skin: SKIN_M, sleeve: "long", sleeveColor: "#8A5C50",
        torso: { type: "dress", color: "#8A5C50" },
        skirt: { hem: 204, color: "#C9B48A", apron: "#EDE7D8" },
        legs: "hose", legColor: "#C9B48A", head: { hair: "bun", hat: "mobcap" } }
    ),
    industrial: W(
      { skin: SKIN_T, sleeve: "long", sleeveColor: "#4A4640",
        torso: { type: "vest", color: "#4A4640", shirt: "#E8E0CB" },
        legs: "pants", legColor: "#3A3A38",
        head: { hair: "short", hat: "flatcap", hatColor: "#2F2D2B" } },
      { skin: SKIN_M, sleeve: "long", sleeveColor: "#2B3A67",
        torso: { type: "dress", color: "#2B3A67", collar: "#EDE7D8" },
        skirt: { hem: 206, color: "#2B3A67", apron: "#EDE7D8" },
        legs: "hose", legColor: "#2B3A67", head: { hair: "bun" } }
    ),
    edwardian: W(
      { skin: SKIN_T, sleeve: "long", sleeveColor: "#35332F",
        torso: { type: "coat", color: "#35332F", hem: 150, collar: "#EDE7D8" },
        legs: "pants", legColor: "#35332F",
        head: { hair: "short", hat: "bowler", hatColor: "#232220" } },
      { skin: SKIN_M, sleeve: "long", sleeveColor: "#EDE7D8",
        torso: { type: "dress", color: "#EDE7D8", collar: "#D9CDAE" },
        skirt: { hem: 212, color: "#3C465F" },
        legs: "hose", legColor: "#3C465F", head: { hair: "updo" } }
    ),
    fifties: W(
      { skin: SKIN_T, sleeve: "long", sleeveColor: "#55524A",
        torso: { type: "coat", color: "#55524A", hem: 146, collar: "#EDE7D8" },
        legs: "pants", legColor: "#4C4A44",
        head: { hair: "short" } },
      { skin: SKIN_M, sleeve: "short", sleeveColor: "#C9A24B",
        torso: { type: "dress", color: "#C9A24B", collar: "#EDE7D8" },
        skirt: { hem: 186, color: "#C9A24B", flare: 34 },
        legs: "hose", legColor: SKIN_M, shoe: "#8C2F2F", head: { hair: "curls" } }
    ),
    contemporary: W(
      { skin: SKIN_T, sleeve: "long", sleeveColor: "#3A3A38",
        torso: { type: "tunic", color: "#3A3A38", hem: 132 },
        legs: "sneaker", legColor: "#3D4A63",
        head: { hair: "short" } },
      { skin: SKIN_M, sleeve: "long", sleeveColor: "#5C6B8C",
        torso: { type: "tunic", color: "#5C6B8C", hem: 128 },
        legs: "sneaker", legColor: "#46536E",
        head: { hair: "ponytail" } }
    )
  };

  /* ---------- the rig ---------- */

  const PIVOTS = {
    armF: [56, 54], armN: [64, 54],
    legF: [56, 118], legN: [64, 118],
    skirt: [60, 112]
  };

  function darken(g) {
    // far-side limbs read slightly darker for cardboard depth
    return `<g style="filter: brightness(0.82)">${g}</g>`;
  }

  function createFigure(who, scale) {
    const ns = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(ns, "svg");
    svg.setAttribute("viewBox", "0 0 120 228");
    svg.setAttribute("width", 120 * scale);
    svg.setAttribute("height", 228 * scale);
    svg.innerHTML = `
      <ellipse class="fig-shadow" cx="60" cy="223" rx="26" ry="5" fill="rgba(30,25,15,0.28)"/>
      <g class="fig-root">
        <g class="fig-armF"></g>
        <g class="fig-legF"></g>
        <g class="fig-legN"></g>
        <g class="fig-torso"></g>
        <g class="fig-skirt"></g>
        <g class="fig-head"></g>
        <g class="fig-armN"></g>
      </g>`;
    const q = (s) => svg.querySelector(s);
    const fig = {
      who, svg,
      root: q(".fig-root"),
      armF: q(".fig-armF"), armN: q(".fig-armN"),
      legF: q(".fig-legF"), legN: q(".fig-legN"),
      torso: q(".fig-torso"), skirt: q(".fig-skirt"), head: q(".fig-head"),
      phaseOffset: who === "mara" ? 0.85 : 0
    };
    return fig;
  }

  function dress(fig, costumeName) {
    const c = COSTUMES[costumeName][fig.who];
    const armCfg = { skin: c.skin, sleeve: c.sleeve, sleeveColor: c.sleeveColor };
    const legCfg = { skin: c.skin, legs: c.legs, legColor: c.legColor, stocking: c.stocking, shoe: c.shoe };

    const place = (el, inner, pivot) => {
      el.innerHTML = `<g transform="translate(${pivot[0]},${pivot[1]})">${inner}</g>`;
    };
    place(fig.armF, darken(armSVG(armCfg)), PIVOTS.armF);
    place(fig.armN, armSVG({ ...armCfg, accessory: c.accessory === "spear" ? "spear" : null }), PIVOTS.armN);
    place(fig.legF, darken(legSVG(legCfg)), PIVOTS.legF);
    place(fig.legN, legSVG(legCfg), PIVOTS.legN);
    fig.torso.innerHTML = torsoSVG(c);
    place(fig.skirt, skirtSVG(c), PIVOTS.skirt);
    fig.head.innerHTML = headSVG(c);
    fig.hasSkirt = !!c.skirt;
  }

  function pose(fig, phase, amp) {
    const p = phase + fig.phaseOffset;
    const swing = 24 * amp * Math.sin(p);
    const armSwing = -19 * amp * Math.sin(p);
    const rot = (el, a, pivot) =>
      el.setAttribute("transform", `rotate(${a.toFixed(2)} ${pivot[0]} ${pivot[1]})`);
    rot(fig.legN, swing, PIVOTS.legN);
    rot(fig.legF, -swing, PIVOTS.legF);
    rot(fig.armN, armSwing, PIVOTS.armN);
    rot(fig.armF, -armSwing, PIVOTS.armF);
    if (fig.hasSkirt) rot(fig.skirt, 2.4 * amp * Math.sin(p), PIVOTS.skirt);
    const bob = -2.6 * amp * Math.abs(Math.cos(p));
    const lean = 2.5 * amp;
    fig.root.setAttribute("transform", `translate(0,${bob.toFixed(2)}) rotate(${lean.toFixed(2)} 60 222)`);
  }

  /* ---------- public API ---------- */

  window.Figures = {
    COSTUMES,
    mount(container, scale = 0.9) {
      const tomas = createFigure("tomas", scale);
      const mara = createFigure("mara", scale * 0.94);
      // Mara walks a half-step behind
      mara.svg.style.marginRight = `${-26 * scale}px`;
      container.appendChild(mara.svg);
      container.appendChild(tomas.svg);
      this._figs = [tomas, mara];
      return this;
    },
    dress(costumeName) {
      this._figs.forEach((f) => dress(f, costumeName));
    },
    pose(phase, amp) {
      this._figs.forEach((f) => pose(f, phase, amp));
    }
  };

})();
