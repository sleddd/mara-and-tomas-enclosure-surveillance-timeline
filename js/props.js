/* ============================================================
   Prop scenes — flat silhouette SVG, one visual language for
   ten millennia. Each scene returns { far, near }: inner SVG
   for two parallax layers, drawn in a 0 0 400 260 viewBox with
   the ground line at y = 260.
   Fills use palette classes: s-iron s-clay s-wheat s-indigo
   s-paper s-red s-glow s-faint
   ============================================================ */

const PROPS = {

  "the-band": {
    far: `<path class="s-faint" d="M0,260 L60,208 L130,244 L210,196 L300,248 L400,214 L400,260 Z"/>`,
    near: `
      <g transform="translate(250,0)">
        <ellipse class="s-iron" cx="0" cy="252" rx="14" ry="7"/>
        <ellipse class="s-iron" cx="34" cy="248" rx="13" ry="7"/>
        <ellipse class="s-iron" cx="64" cy="254" rx="14" ry="7"/>
        <ellipse class="s-iron" cx="-30" cy="248" rx="13" ry="7"/>
        <ellipse class="s-iron" cx="-58" cy="254" rx="14" ry="7"/>
        <path class="s-iron" d="M-22,244 L28,238 L24,244 L-18,250 Z"/>
        <path class="s-iron" d="M-24,238 L26,246 L22,251 L-20,244 Z"/>
        <path class="s-red" d="M2,244 C-10,226 -4,210 2,196 C4,210 12,212 10,224 C18,214 16,206 14,198 C26,212 24,232 12,244 Z"/>
        <path class="s-wheat" d="M4,242 C-2,230 0,220 4,210 C6,220 12,224 8,234 C12,230 12,224 11,218 C17,228 14,238 8,243 Z"/>
      </g>`
  },

  "the-hedge": {
    far: `
      <g transform="translate(240,0)">
        <path class="s-clay" d="M-60,260 C-60,208 -18,184 24,184 C66,184 104,210 104,260 Z"/>
        <path class="s-paper" d="M8,260 L8,224 C8,214 34,214 34,224 L34,260 Z"/>
        <path class="s-faint" d="M-40,236 h20 M-14,214 h22 M46,222 h24 M60,242 h22" stroke="currentColor"/>
        <rect class="s-faint" x="-38" y="232" width="18" height="4" rx="2"/>
        <rect class="s-faint" x="-10" y="212" width="20" height="4" rx="2"/>
        <rect class="s-faint" x="48" y="222" width="20" height="4" rx="2"/>
      </g>`,
    near: (() => {
      let stalks = "";
      for (let i = 0; i < 9; i++) {
        const x = 40 + i * 16 + (i % 3) * 4, h = 54 + (i % 4) * 10, sway = (i % 2 ? 4 : -3);
        stalks += `<path class="s-wheat" d="M${x},260 C${x + sway},${260 - h / 2} ${x + sway},${260 - h + 12} ${x + sway},${260 - h}" stroke-width="2.5" fill="none" stroke="currentColor" style="stroke:var(--wheat)"/>
          <ellipse class="s-wheat" cx="${x + sway}" cy="${260 - h - 5}" rx="3.4" ry="9"/>`;
      }
      return `<g>${stalks}</g>`;
    })()
  },

  "the-long-ambiguity": {
    far: `
      <path class="s-faint" d="M210,260 L268,214 L318,242 L360,206 L400,236 L400,260 Z"/>
      <path class="s-faint" d="M330,206 l6,-14 l6,14 Z"/>
      <path class="s-faint" d="M352,222 l5,-12 l5,12 Z"/>`,
    near: `
      <g>
        <path class="s-clay" d="M20,260 L150,260 L138,248 L32,248 Z"/>
        <path class="s-clay" d="M34,244 L136,244 L128,234 L44,234 Z"/>
        <path class="s-clay" d="M48,230 L124,230 L118,222 L56,222 Z"/>
        <rect class="s-iron" x="166" y="216" width="6" height="44"/>
        <rect class="s-iron" x="160" y="216" width="18" height="5"/>
      </g>`
  },

  "the-trap-closed": {
    far: `
      <g transform="translate(260,0)">
        <rect class="s-clay" x="-44" y="196" width="88" height="52"/>
        <path class="s-iron" d="M-52,196 L0,158 L52,196 Z"/>
        <rect class="s-iron" x="-38" y="248" width="10" height="12"/>
        <rect class="s-iron" x="28" y="248" width="10" height="12"/>
        <rect class="s-paper" x="-10" y="214" width="20" height="24"/>
      </g>`,
    near: `
      <g transform="translate(120,0)">
        <ellipse class="s-iron" cx="0" cy="252" rx="34" ry="9"/>
        <path class="s-iron" d="M-30,250 C-30,238 30,238 30,250 Z"/>
        <ellipse class="s-clay" cx="4" cy="238" rx="18" ry="6"/>
        <path class="s-wheat" d="M40,252 c2,-18 8,-26 6,-40 c6,10 4,26 0,40 Z"/>
        <path class="s-wheat" d="M50,252 c4,-14 10,-22 10,-34 c4,12 0,24 -4,34 Z"/>
      </g>`
  },

  "the-grain-state": {
    far: `
      <g transform="translate(210,0)">
        <rect class="s-clay" x="-90" y="200" width="180" height="30"/>
        <rect class="s-clay" x="-70" y="170" width="140" height="30"/>
        <rect class="s-clay" x="-50" y="140" width="100" height="30"/>
        <rect class="s-clay" x="-30" y="112" width="60" height="28"/>
        <path class="s-iron" d="M-6,140 L-6,112 L6,112 L6,140 Z" opacity="0.35"/>
      </g>
      <g class="s-iron">
        <rect x="0" y="230" width="400" height="30"/>
        <rect x="6" y="222" width="16" height="8"/><rect x="34" y="222" width="16" height="8"/>
        <rect x="62" y="222" width="16" height="8"/><rect x="90" y="222" width="16" height="8"/>
        <rect x="118" y="222" width="16" height="8"/><rect x="146" y="222" width="16" height="8"/>
        <rect x="174" y="222" width="16" height="8"/><rect x="202" y="222" width="16" height="8"/>
        <rect x="230" y="222" width="16" height="8"/><rect x="258" y="222" width="16" height="8"/>
        <rect x="286" y="222" width="16" height="8"/><rect x="314" y="222" width="16" height="8"/>
        <rect x="342" y="222" width="16" height="8"/><rect x="370" y="222" width="16" height="8"/>
      </g>`,
    near: `
      <g transform="translate(84,0) rotate(-8 0 236)">
        <rect class="s-clay" x="-26" y="212" width="52" height="40" rx="4"/>
        <g class="s-iron" opacity="0.7">
          <rect x="-18" y="220" width="10" height="3"/><rect x="-4" y="220" width="14" height="3"/>
          <rect x="-18" y="228" width="16" height="3"/><rect x="4" y="228" width="12" height="3"/>
          <rect x="-18" y="236" width="8" height="3"/><rect x="-6" y="236" width="18" height="3"/>
          <rect x="-18" y="244" width="14" height="3"/>
        </g>
      </g>`
  },

  "flight-and-collapse": {
    far: `
      <path class="s-faint" d="M180,260 L240,196 L292,232 L344,186 L400,224 L400,260 Z"/>`,
    near: `
      <g class="s-iron">
        <path d="M20,260 L20,214 L120,214 L124,222 L118,230 L124,238 L120,246 L120,260 Z"/>
        <path d="M196,260 L196,222 L200,214 L280,214 L280,260 Z"/>
        <rect x="30" y="206" width="14" height="8"/><rect x="56" y="206" width="14" height="8"/>
        <rect x="82" y="206" width="14" height="8"/><rect x="206" y="206" width="14" height="8"/>
        <rect x="232" y="206" width="14" height="8"/><rect x="258" y="206" width="14" height="8"/>
        <path class="s-faint" d="M136,252 l10,-4 M154,246 l12,-5 M172,240 l10,-4" stroke="currentColor"/>
        <ellipse class="s-faint" cx="142" cy="252" rx="6" ry="3"/>
        <ellipse class="s-faint" cx="160" cy="246" rx="6" ry="3"/>
        <ellipse class="s-faint" cx="178" cy="240" rx="6" ry="3"/>
      </g>`
  },

  "the-classical-household": {
    far: `
      <g transform="translate(230,0)" class="s-clay">
        <rect x="-110" y="180" width="220" height="80"/>
        <path d="M-122,180 L0,140 L122,180 Z"/>
        <rect class="s-paper" x="-88" y="196" width="14" height="64"/>
        <rect class="s-paper" x="-52" y="196" width="14" height="64"/>
        <rect class="s-paper" x="38" y="196" width="14" height="64"/>
        <rect class="s-paper" x="74" y="196" width="14" height="64"/>
      </g>`,
    near: `
      <g transform="translate(226,0)">
        <rect class="s-iron" x="-26" y="188" width="52" height="72"/>
        <rect class="s-clay" x="-21" y="194" width="19" height="66"/>
        <rect class="s-clay" x="2" y="194" width="19" height="66"/>
        <circle class="s-iron" cx="-6" cy="228" r="2.6"/>
        <circle class="s-iron" cx="6" cy="228" r="2.6"/>
      </g>`
  },

  "village-and-manor": {
    far: `
      <g transform="translate(268,0)" class="s-iron">
        <rect x="-18" y="150" width="36" height="110"/>
        <path d="M-24,150 L0,118 L24,150 Z"/>
        <rect x="-2" y="104" width="4" height="16"/>
        <rect x="-8" y="110" width="16" height="4"/>
        <rect x="20" y="206" width="90" height="54"/>
        <path d="M14,206 L65,182 L116,206 Z"/>
        <rect class="s-paper" x="-6" y="168" width="12" height="18" rx="6"/>
      </g>`,
    near: `
      <g transform="translate(110,0)">
        <path class="s-clay" d="M-64,260 L-64,214 L64,214 L64,260 Z"/>
        <path class="s-iron" d="M-76,216 L0,178 L76,216 Z"/>
        <rect class="s-iron" x="-12" y="230" width="24" height="30"/>
        <rect class="s-paper" x="30" y="226" width="14" height="12"/>
        <rect class="s-iron" x="36" y="226" width="2" height="12"/>
        <rect class="s-iron" x="30" y="231" width="14" height="2"/>
      </g>`
  },

  "the-confessor": {
    far: `
      <path class="s-faint" d="M240,260 L240,170 C240,130 320,130 320,170 L320,260 Z"/>`,
    near: `
      <g transform="translate(180,0)">
        <rect class="s-iron" x="-70" y="150" width="140" height="110"/>
        <path class="s-iron" d="M-78,150 L0,120 L78,150 Z"/>
        <rect class="s-paper" x="-52" y="168" width="46" height="70"/>
        <g class="s-iron" opacity="0.75">
          <rect x="-52" y="180" width="46" height="3"/><rect x="-52" y="194" width="46" height="3"/>
          <rect x="-52" y="208" width="46" height="3"/><rect x="-52" y="222" width="46" height="3"/>
          <rect x="-40" y="168" width="3" height="70"/><rect x="-26" y="168" width="3" height="70"/>
          <rect x="-12" y="168" width="3" height="70"/>
        </g>
        <rect class="s-clay" x="16" y="236" width="46" height="10"/>
        <rect class="s-clay" x="20" y="246" width="38" height="14"/>
      </g>`
  },

  "charivari": {
    far: `
      <path class="s-faint" d="M40,260 L40,224 L96,224 L96,260 Z M60,224 L68,210 L88,210 L96,224 Z"/>
      <path class="s-faint" d="M300,72 a20,20 0 1 0 14,34 a16,16 0 1 1 -14,-34 Z"/>`,
    near: `
      <g transform="translate(200,0)">
        <circle class="s-wheat" cx="0" cy="196" r="30" opacity="0.28"/>
        <rect class="s-iron" x="-4" y="188" width="8" height="26"/>
        <rect class="s-iron" x="-9" y="182" width="18" height="8" rx="2"/>
        <rect class="s-wheat" x="-6" y="192" width="12" height="18" opacity="0.85"/>
        <path class="s-iron" d="M-70,236 a20,14 0 1 0 0.1,0 Z M-56,222 l8,-10 l6,4 l-8,10 Z"/>
        <path class="s-iron" d="M40,246 c0,-14 24,-14 24,0 l4,10 l-32,0 Z"/>
        <path class="s-clay" d="M84,250 c26,-4 34,-16 36,-30 c10,16 0,34 -22,38 c14,2 24,0 30,-4 c-6,10 -22,14 -44,10 Z"/>
      </g>`
  },

  "the-tithingman": {
    far: `
      <g transform="translate(250,0)" class="s-iron">
        <rect x="-80" y="182" width="160" height="78"/>
        <path d="M-92,182 L0,140 L92,182 Z"/>
        <rect x="-10" y="104" width="20" height="40"/>
        <path d="M-14,104 L0,86 L14,104 Z"/>
        <rect class="s-paper" x="-14" y="200" width="28" height="60"/>
        <rect class="s-paper" x="-58" y="200" width="18" height="24"/>
        <rect class="s-paper" x="40" y="200" width="18" height="24"/>
      </g>`,
    near: `
      <g transform="translate(96,0)">
        <path class="s-paper" d="M-44,238 L0,230 L44,238 L44,256 L0,248 L-44,256 Z"/>
        <path class="s-iron" d="M-44,238 L0,230 L0,248 L-44,256 Z" opacity="0.14"/>
        <rect class="s-iron" x="-1.2" y="230" width="2.4" height="18"/>
        <g class="s-iron" opacity="0.55">
          <rect x="-36" y="240" width="28" height="2"/><rect x="-36" y="246" width="24" height="2"/>
          <rect x="8" y="240" width="28" height="2"/><rect x="8" y="246" width="24" height="2"/>
        </g>
      </g>`
  },

  "the-statute-of-labourers": {
    far: `
      <path class="s-faint" d="M0,260 L0,232 L60,222 L120,236 L120,260 Z"/>
      <path class="s-faint" d="M300,260 L300,224 L340,214 L400,230 L400,260 Z"/>`,
    near: `
      <g transform="translate(140,0)">
        <rect class="s-iron" x="-14" y="182" width="28" height="78" rx="2"/>
        <path class="s-iron" d="M-22,182 L0,160 L22,182 Z"/>
        <rect class="s-paper" x="-9" y="196" width="18" height="24"/>
        <rect class="s-iron" x="-9" y="204" width="18" height="2.4" opacity="0.6"/>
        <rect class="s-iron" x="-9" y="212" width="18" height="2.4" opacity="0.6"/>
      </g>
      <g transform="translate(232,0)">
        <path class="s-clay" d="M-30,260 C-30,222 30,222 30,260 Z"/>
        <rect class="s-iron" x="-4" y="196" width="8" height="28"/>
        <path class="s-iron" d="M-16,196 L16,196 L16,203 L-16,203 Z"/>
        <path class="s-iron" d="M-16,199.5 a16,7 0 1 0 0.1,0 Z" opacity="0.5"/>
      </g>`
  },

  "putting-out": {
    far: `
      <g transform="translate(120,0)" class="s-faint">
        <rect x="-70" y="200" width="140" height="60"/>
        <path d="M-82,204 C-60,176 60,176 82,204 L74,204 C56,186 -56,186 -74,204 Z"/>
        <rect x="-10" y="222" width="24" height="38"/>
      </g>`,
    near: `
      <g transform="translate(250,0)">
        <rect class="s-clay" x="-60" y="160" width="8" height="100"/>
        <rect class="s-clay" x="52" y="160" width="8" height="100"/>
        <rect class="s-clay" x="-64" y="160" width="128" height="8"/>
        <rect class="s-clay" x="-64" y="196" width="128" height="6"/>
        <g class="s-iron" opacity="0.6">
          <rect x="-48" y="168" width="2" height="80"/><rect x="-34" y="168" width="2" height="80"/>
          <rect x="-20" y="168" width="2" height="80"/><rect x="-6" y="168" width="2" height="80"/>
          <rect x="8" y="168" width="2" height="80"/><rect x="22" y="168" width="2" height="80"/>
          <rect x="36" y="168" width="2" height="80"/>
        </g>
        <rect class="s-paper" x="-52" y="214" width="96" height="14" opacity="0.9"/>
        <path class="s-paper" d="M84,260 c-14,-4 -16,-22 -4,-30 c-2,-10 12,-16 18,-8 c10,-6 22,2 20,12 c10,4 8,20 -4,24 Z"/>
        <path class="s-paper" d="M130,260 c-10,-4 -12,-16 -2,-22 c0,-8 12,-10 16,-4 c8,-2 14,6 12,12 c6,4 4,12 -4,14 Z" opacity="0.85"/>
      </g>`
  },

  "the-mill": {
    far: `
      <g class="s-iron">
        <rect x="150" y="150" width="190" height="110"/>
        <g class="s-paper" opacity="0.9">
          <rect x="162" y="164" width="12" height="18"/><rect x="184" y="164" width="12" height="18"/>
          <rect x="206" y="164" width="12" height="18"/><rect x="228" y="164" width="12" height="18"/>
          <rect x="250" y="164" width="12" height="18"/><rect x="272" y="164" width="12" height="18"/>
          <rect x="294" y="164" width="12" height="18"/><rect x="316" y="164" width="12" height="18"/>
          <rect x="162" y="196" width="12" height="18"/><rect x="184" y="196" width="12" height="18"/>
          <rect x="206" y="196" width="12" height="18"/><rect x="228" y="196" width="12" height="18"/>
          <rect x="250" y="196" width="12" height="18"/><rect x="272" y="196" width="12" height="18"/>
          <rect x="294" y="196" width="12" height="18"/><rect x="316" y="196" width="12" height="18"/>
        </g>
        <rect x="226" y="96" width="38" height="56"/>
        <path d="M220,96 L245,76 L270,96 Z"/>
        <circle class="s-paper" cx="245" cy="116" r="11"/>
        <path class="s-iron" d="M245,116 L245,108 M245,116 L251,118" stroke="currentColor" stroke-width="2"/>
        <rect x="245" y="107" width="1.8" height="9"/>
        <rect x="245" y="115" width="7" height="1.8"/>
        <g>
          <rect x="20" y="206" width="34" height="54"/><path d="M16,206 L37,192 L58,206 Z"/>
          <rect x="62" y="206" width="34" height="54"/><path d="M58,206 L79,192 L100,206 Z"/>
          <rect x="104" y="206" width="34" height="54"/><path d="M100,206 L121,192 L142,206 Z"/>
        </g>
      </g>`,
    near: `
      <g transform="translate(80,0)">
        <path class="s-wheat" d="M0,206 C-16,206 -20,224 -13,232 L13,232 C20,224 16,206 0,206 Z"/>
        <rect class="s-wheat" x="-4" y="200" width="8" height="7"/>
        <circle class="s-iron" cx="0" cy="235" r="3.4"/>
        <rect class="s-iron" x="-1.4" y="235" width="2.8" height="12"/>
      </g>`
  },

  "the-turnouts": {
    far: (() => {
      let crowd = "";
      const xs = [210, 236, 258, 284, 306, 330, 354, 226, 274, 318];
      xs.forEach((x, i) => {
        const h = 62 + (i % 3) * 8, y = 260 - h;
        crowd += `<circle class="s-faint" cx="${x}" cy="${y}" r="9"/>
          <path class="s-faint" d="M${x - 11},260 L${x - 8},${y + 10} L${x + 8},${y + 10} L${x + 11},260 Z"/>`;
      });
      return crowd;
    })(),
    near: `
      <g transform="translate(96,0) rotate(-6 0 220)">
        <rect class="s-paper" x="-42" y="176" width="84" height="84"/>
        <rect class="s-iron" x="-30" y="188" width="60" height="4" opacity="0.75"/>
        <g class="s-iron" opacity="0.5">
          <rect x="-30" y="202" width="52" height="2.5"/><rect x="-30" y="211" width="58" height="2.5"/>
          <rect x="-30" y="220" width="48" height="2.5"/><rect x="-30" y="229" width="56" height="2.5"/>
          <rect x="-30" y="238" width="30" height="2.5"/>
        </g>
        <path class="s-indigo" d="M-28,248 c8,-6 14,2 22,-3" stroke="currentColor" stroke-width="2" fill="none" style="stroke:var(--indigo)"/>
      </g>`
  },

  "eight-hours": {
    far: `
      <g class="s-iron">
        <rect x="30" y="212" width="60" height="48"/><path d="M30,212 L60,198 L90,212 Z"/>
        <rect x="100" y="220" width="52" height="40"/><path d="M100,220 L126,206 L152,220 Z"/>
        <rect x="240" y="196" width="120" height="64"/>
        <rect x="262" y="150" width="14" height="46"/>
        <g class="s-wheat" opacity="0.9">
          <rect x="44" y="224" width="9" height="12"/><rect x="68" y="224" width="9" height="12"/>
          <rect x="112" y="230" width="9" height="12"/><rect x="132" y="230" width="9" height="12"/>
        </g>
      </g>`,
    near: `
      <g transform="translate(196,0)">
        <path class="s-faint" d="M74,124 c-4,-12 4,-22 14,-24 c-8,10 -6,18 -2,26 c-8,2 -10,0 -12,-2 Z"/>
        <path class="s-faint" d="M86,100 c0,-10 10,-16 18,-14 c-8,6 -10,14 -8,22 Z" opacity="0.7"/>
        <rect class="s-iron" x="-64" y="160" width="5" height="100"/>
        <path class="s-iron" d="M-73,160 L-52,160 L-56,148 L-69,148 Z"/>
        <circle class="s-wheat" cx="-62" cy="156" r="14" opacity="0.32"/>
        <circle class="s-wheat" cx="-62" cy="154" r="6"/>
      </g>`
  },

  "her-wage": {
    far: `
      <g transform="translate(280,0)">
        <rect class="s-iron" x="-34" y="150" width="68" height="110"/>
        <rect class="s-clay" x="-28" y="158" width="56" height="102"/>
        <rect class="s-iron" x="-28" y="204" width="56" height="3" opacity="0.5"/>
        <circle class="s-iron" cx="18" cy="212" r="4"/>
        <rect class="s-iron" x="16.6" y="212" width="2.8" height="10"/>
      </g>`,
    near: `
      <g transform="translate(110,0) rotate(-4 0 236)">
        <rect class="s-paper" x="-46" y="216" width="92" height="44"/>
        <path class="s-iron" d="M-46,216 L0,244 L46,216" fill="none" stroke="currentColor" stroke-width="2.5" style="stroke:var(--iron)" opacity="0.7"/>
        <circle class="s-wheat" cx="30" cy="204" r="12"/>
        <circle class="s-wheat" cx="14" cy="198" r="9" opacity="0.8"/>
      </g>
      <g transform="translate(206,0) rotate(24 0 216)">
        <circle class="s-iron" cx="0" cy="196" r="11" fill="none" stroke-width="5" stroke="currentColor" style="stroke:var(--iron)"/>
        <rect class="s-iron" x="8" y="193" width="42" height="6"/>
        <rect class="s-iron" x="40" y="199" width="6" height="9"/>
        <rect class="s-iron" x="30" y="199" width="6" height="6"/>
      </g>`
  },

  "privacy-invented": {
    far: `
      <g class="s-faint">
        <path d="M120,260 L120,140 L200,140 L200,260 L188,260 L188,152 L132,152 L132,260 Z"/>
        <path d="M156,260 L156,168 L216,168 L216,260 L206,260 L206,178 L166,178 L166,260 Z"/>
        <path d="M186,260 L186,190 L232,190 L232,260 L224,260 L224,198 L194,198 L194,260 Z"/>
      </g>`,
    near: `
      <g transform="translate(300,0)">
        <path class="s-indigo" d="M-36,232 L0,226 L0,260 L-36,260 Z"/>
        <path class="s-clay" d="M0,226 L36,232 L36,260 L0,260 Z"/>
        <rect class="s-wheat" x="-4" y="226" width="8" height="34" rx="2"/>
        <circle class="s-wheat" cx="0" cy="243" r="4"/>
      </g>
      <g transform="translate(206,0)">
        <rect class="s-iron" x="-24" y="212" width="48" height="48" rx="3"/>
        <circle class="s-paper" cx="0" cy="236" r="13"/>
        <circle class="s-iron" cx="0" cy="236" r="7"/>
        <rect class="s-iron" x="-24" y="206" width="20" height="8" rx="2"/>
      </g>`
  },

  "privacy-in-public": {
    far: `
      <g transform="translate(220,0)">
        <path class="s-indigo" d="M-120,260 L-120,150 C-120,96 120,96 120,150 L120,260 L96,260 L96,156 C96,116 -96,116 -96,156 L-96,260 Z"/>
        <g class="s-wheat">
          <circle cx="-84" cy="150" r="4"/><circle cx="-64" cy="136" r="4"/><circle cx="-40" cy="126" r="4"/>
          <circle cx="-14" cy="121" r="4"/><circle cx="14" cy="121" r="4"/><circle cx="40" cy="126" r="4"/>
          <circle cx="64" cy="136" r="4"/><circle cx="84" cy="150" r="4"/>
        </g>
        <rect class="s-wheat" x="-58" y="150" width="116" height="30" opacity="0.28"/>
        <rect class="s-paper" x="-52" y="154" width="104" height="22"/>
        <g class="s-iron">
          <rect x="-42" y="160" width="10" height="10"/><rect x="-26" y="160" width="10" height="10"/>
          <rect x="-10" y="160" width="10" height="10"/><rect x="6" y="160" width="10" height="10"/>
          <rect x="22" y="160" width="10" height="10"/><rect x="36" y="160" width="8" height="10"/>
        </g>
      </g>`,
    near: `
      <g transform="translate(80,0)">
        <rect class="s-iron" x="-2.5" y="140" width="5" height="120"/>
        <path class="s-iron" d="M-2.5,146 C-20,146 -22,128 -8,126 L0,126 Z"/>
        <circle class="s-wheat" cx="-14" cy="134" r="13" opacity="0.35"/>
        <circle class="s-wheat" cx="-14" cy="134" r="5.5"/>
      </g>`
  },

  "the-employer-reaches-over": {
    far: `
      <g transform="translate(260,0)" class="s-clay">
        <rect x="-92" y="176" width="184" height="84"/>
        <path class="s-iron" d="M-102,176 L0,128 L102,176 Z"/>
        <rect class="s-iron" x="-22" y="196" width="44" height="64"/>
        <rect class="s-paper" x="-17" y="202" width="34" height="52"/>
        <rect class="s-paper" x="-72" y="196" width="22" height="26"/>
        <rect class="s-paper" x="50" y="196" width="22" height="26"/>
        <rect class="s-iron" x="-30" y="188" width="60" height="6"/>
      </g>`,
    near: `
      <g transform="translate(120,0)" class="s-iron">
        <circle cx="0" cy="152" r="11"/>
        <path d="M-13,148 L13,148 L13,144 L-13,144 Z M-9,144 L9,144 L9,136 L-9,136 Z"/>
        <path d="M-14,260 L-12,182 C-12,168 12,168 12,182 L14,260 L4,260 L2,206 L-2,206 L-4,260 Z"/>
        <path d="M10,176 L30,192 L28,214 L22,213 L23,196 L8,186 Z"/>
        <rect class="s-paper" x="18" y="206" width="22" height="30"/>
        <rect x="20" y="212" width="18" height="2" opacity="0.6"/>
        <rect x="20" y="218" width="14" height="2" opacity="0.6"/>
        <rect x="20" y="224" width="17" height="2" opacity="0.6"/>
      </g>`
  },

  "the-commute": {
    far: `
      <g class="s-faint">
        <rect x="10" y="150" width="70" height="90"/>
        <path d="M4,150 L45,120 L86,150 Z"/>
        <rect x="300" y="180" width="90" height="60"/>
        <rect x="308" y="188" width="16" height="16"/><rect x="332" y="188" width="16" height="16"/>
        <rect x="356" y="188" width="16" height="16"/><rect x="308" y="212" width="16" height="16"/>
        <rect x="332" y="212" width="16" height="16"/><rect x="356" y="212" width="16" height="16"/>
      </g>`,
    near: `
      <g>
        <rect class="s-iron" x="0" y="236" width="400" height="3" opacity="0.6"/>
        <rect class="s-faint" x="40" y="234" width="24" height="2"/>
        <rect class="s-faint" x="100" y="234" width="24" height="2"/>
        <rect class="s-faint" x="160" y="234" width="24" height="2"/>
        <g transform="translate(200,0)">
          <path class="s-clay" d="M-40,236 L-34,214 C-30,206 30,206 34,214 L40,236 Z"/>
          <path class="s-iron" d="M-24,214 L-14,198 L14,198 L24,214 Z" opacity="0.75"/>
          <circle class="s-iron" cx="-24" cy="236" r="8"/>
          <circle class="s-iron" cx="24" cy="236" r="8"/>
          <rect class="s-glow" x="-30" y="220" width="12" height="8" opacity="0.7"/>
        </g>
      </g>`
  },

  "the-wired-home": {
    far: `
      <g transform="translate(250,0)">
        <rect class="s-clay" x="-100" y="188" width="200" height="72"/>
        <path class="s-iron" d="M-112,188 L-20,148 L72,188 Z"/>
        <rect class="s-clay" x="8" y="168" width="92" height="20"/>
        <rect class="s-iron" x="30" y="100" width="4" height="50"/>
        <path class="s-iron" d="M12,108 L52,100 M14,118 L50,112" stroke="currentColor" stroke-width="3" fill="none" style="stroke:var(--iron)"/>
        <rect class="s-iron" x="10" y="106" width="44" height="3" transform="rotate(-8 32 108)"/>
        <rect class="s-iron" x="12" y="116" width="40" height="3" transform="rotate(-8 32 118)"/>
        <rect class="s-iron" x="-58" y="206" width="30" height="54"/>
        <rect class="s-paper" x="-16" y="206" width="26" height="22"/>
        <rect class="s-paper" x="52" y="206" width="26" height="22"/>
      </g>`,
    near: `
      <g transform="translate(96,0)">
        <rect class="s-iron" x="-38" y="196" width="76" height="52" rx="6"/>
        <rect class="s-glow" x="-30" y="204" width="52" height="36" rx="3"/>
        <circle class="s-iron" cx="30" cy="212" r="3"/>
        <circle class="s-iron" cx="30" cy="224" r="3"/>
        <path class="s-iron" d="M-10,196 L-2,178 M6,196 L20,180" stroke="currentColor" stroke-width="2.5" fill="none" style="stroke:var(--iron)"/>
        <rect class="s-iron" x="-26" y="248" width="8" height="12"/>
        <rect class="s-iron" x="18" y="248" width="8" height="12"/>
      </g>`
  },

  "the-file": {
    far: `
      <g class="s-faint">
        <rect x="236" y="176" width="42" height="84"/>
        <rect x="243" y="184" width="28" height="3"/><rect x="243" y="204" width="28" height="3"/>
        <rect x="243" y="224" width="28" height="3"/><rect x="243" y="244" width="28" height="3"/>
        <rect x="292" y="192" width="34" height="68"/>
        <rect x="298" y="200" width="22" height="2.5"/><rect x="298" y="217" width="22" height="2.5"/>
        <rect x="298" y="234" width="22" height="2.5"/><rect x="298" y="251" width="22" height="2.5"/>
        <rect x="336" y="204" width="26" height="56"/>
        <rect x="341" y="211" width="16" height="2"/><rect x="341" y="225" width="16" height="2"/>
        <rect x="341" y="239" width="16" height="2"/><rect x="341" y="253" width="16" height="2"/>
      </g>`,
    near: `
      <g transform="translate(120,0)" class="s-iron">
        <rect x="-42" y="130" width="84" height="130"/>
        <g class="s-paper">
          <rect x="-32" y="142" width="64" height="24" rx="2"/>
          <rect x="-32" y="174" width="64" height="24" rx="2"/>
          <rect x="-32" y="206" width="64" height="24" rx="2"/>
          <rect x="-32" y="238" width="64" height="16" rx="2"/>
        </g>
        <rect x="-12" y="151" width="24" height="5"/>
        <rect x="-12" y="183" width="24" height="5"/>
        <rect x="-12" y="215" width="24" height="5"/>
        <rect x="-12" y="243" width="24" height="5"/>
        <rect class="s-paper" x="14" y="134" width="20" height="6" transform="rotate(-14 24 137)"/>
      </g>`
  },

  "behavioral-surplus": {
    far: `
      <g class="s-faint">
        <rect x="60" y="90" width="200" height="140" rx="4" fill="none" stroke="currentColor" stroke-width="1.5"/>
        <rect x="60" y="90" width="200" height="20" rx="4"/>
        <circle cx="72" cy="100" r="3"/><circle cx="84" cy="100" r="3"/><circle cx="96" cy="100" r="3"/>
        <rect x="76" y="130" width="168" height="14" rx="7" fill="none" stroke="currentColor" stroke-width="1.5"/>
      </g>`,
    near: `
      <g transform="translate(200,0)">
        <circle class="s-wheat" cx="0" cy="150" r="16" opacity="0.9"/>
        <path class="s-iron" d="M-6,144 a2,2 0 1 1 0.1,0 Z" opacity="0.5"/>
        <path class="s-iron" d="M5,146 a1.6,1.6 0 1 1 0.1,0 Z" opacity="0.5"/>
        <path class="s-iron" d="M-2,156 a1.8,1.8 0 1 1 0.1,0 Z" opacity="0.5"/>
        <path class="s-glow" d="M20,158 C40,158 44,172 62,172" fill="none" stroke="currentColor" stroke-width="2"/>
        <circle class="s-glow" cx="62" cy="172" r="3.5"/>
        <path class="s-glow" d="M20,158 C50,140 70,190 100,180" fill="none" stroke="currentColor" stroke-width="2" opacity="0.7"/>
        <circle class="s-glow" cx="100" cy="180" r="3" opacity="0.7"/>
      </g>`
  },

  "the-exhibition": {
    far: (() => {
      let heads = "";
      const xs = [220, 248, 274, 302, 330, 358, 234, 288, 344];
      xs.forEach((x, i) => {
        const h = 66 + (i % 3) * 10, y = 260 - h;
        heads += `<circle class="s-faint" cx="${x}" cy="${y}" r="10"/>
          <path class="s-faint" d="M${x - 12},260 L${x - 9},${y + 11} L${x + 9},${y + 11} L${x + 12},260 Z"/>`;
      });
      return heads;
    })(),
    near: `
      <g>
        <g transform="translate(70,0) rotate(-10 0 216)">
          <path class="s-iron" d="M-6,260 L-4,224 L10,222 L12,260 Z"/>
          <rect class="s-iron" x="-14" y="196" width="30" height="44" rx="4"/>
          <rect class="s-glow" x="-10" y="200" width="22" height="36" rx="2"/>
        </g>
        <g transform="translate(140,0) rotate(6 0 216)">
          <path class="s-iron" d="M-6,260 L-4,228 L10,226 L12,260 Z"/>
          <rect class="s-iron" x="-14" y="200" width="30" height="44" rx="4"/>
          <rect class="s-glow" x="-10" y="204" width="22" height="36" rx="2"/>
        </g>
        <g transform="translate(206,0) rotate(-4 0 216)">
          <path class="s-iron" d="M-6,260 L-4,222 L10,220 L12,260 Z"/>
          <rect class="s-iron" x="-14" y="192" width="30" height="44" rx="4"/>
          <rect class="s-glow" x="-10" y="196" width="22" height="36" rx="2"/>
        </g>
      </g>`
  },

  "the-doppel-lab": {
    far: `
      <g class="s-faint">
        <rect x="90" y="80" width="220" height="180" rx="2" fill="none" stroke="currentColor" stroke-width="1.5"/>
        <rect x="90" y="120" width="220" height="1.5"/><rect x="90" y="160" width="220" height="1.5"/>
        <rect x="90" y="200" width="220" height="1.5"/>
        <rect x="130" y="80" width="1.5" height="180"/><rect x="170" y="80" width="1.5" height="180"/>
        <rect x="210" y="80" width="1.5" height="180"/><rect x="250" y="80" width="1.5" height="180"/>
        <path d="M90,80 L200,50 L310,80" fill="none" stroke="currentColor" stroke-width="1.5"/>
      </g>`,
    near: `
      <g>
        <circle class="s-glow" cx="150" cy="108" r="5" opacity="0.9"/>
        <circle class="s-glow" cx="230" cy="140" r="4" opacity="0.75"/>
        <circle class="s-glow" cx="180" cy="180" r="6" opacity="0.85"/>
        <circle class="s-glow" cx="270" cy="210" r="4" opacity="0.7"/>
        <circle class="s-glow" cx="120" cy="220" r="4.5" opacity="0.8"/>
        <circle class="s-wheat" cx="200" cy="150" r="3" opacity="0.9"/>
        <g transform="translate(200,254)">
          <rect class="s-iron" x="-18" y="-18" width="36" height="18" rx="2"/>
          <rect class="s-glow" x="-14" y="-14" width="28" height="10" rx="1" opacity="0.6"/>
        </g>
      </g>`
  },

  "the-cubicle": {
    far: `
      <g class="s-faint">
        <rect x="60" y="150" width="280" height="4"/>
        <rect x="60" y="150" width="4" height="110"/><rect x="130" y="150" width="4" height="110"/>
        <rect x="200" y="150" width="4" height="110"/><rect x="270" y="150" width="4" height="110"/>
        <rect x="336" y="150" width="4" height="110"/>
      </g>`,
    near: (() => {
      let cubes = "";
      const xs = [40, 130, 220, 310];
      xs.forEach((x, i) => {
        const h = 46 - i * 3;
        cubes += `<g transform="translate(${x},0)">
          <path class="s-iron" d="M-30,260 L-30,${260 - h} L30,${260 - h} L30,260 Z" opacity="${0.9 - i * 0.06}"/>
          <rect class="s-glow" x="-20" y="${260 - h + 8}" width="24" height="16" opacity="0.55"/>
        </g>`;
      });
      return cubes;
    })()
  },

  "the-profile-governs": {
    far: `
      <g class="s-faint">
        <rect x="150" y="90" width="1.5" height="170"/><rect x="190" y="70" width="1.5" height="190"/>
        <rect x="230" y="100" width="1.5" height="160"/><rect x="270" y="60" width="1.5" height="200"/>
        <rect x="310" y="90" width="1.5" height="170"/><rect x="350" y="76" width="1.5" height="184"/>
        <circle cx="190" cy="110" r="3"/><circle cx="270" cy="96" r="3"/><circle cx="350" cy="126" r="3"/>
        <circle cx="150" cy="146" r="3"/><circle cx="230" cy="170" r="3"/><circle cx="310" cy="150" r="3"/>
      </g>`,
    near: `
      <g transform="translate(250,0)" opacity="0.4">
        <g class="s-glow">
          <circle cx="0" cy="106" r="14"/>
          <path d="M-16,260 L-13,132 C-13,118 13,118 13,132 L16,260 L5,260 L2,196 L-2,196 L-5,260 Z"/>
        </g>
        <g class="s-glow" transform="translate(56,10)">
          <circle cx="0" cy="106" r="12.5"/>
          <path d="M-14,250 L-11,130 C-11,117 11,117 11,130 L14,250 L4,250 L2,190 L-2,190 L-4,250 Z"/>
        </g>
      </g>`
  },

  "the-gateless-day": {
    far: `
      <g class="s-faint">
        <rect x="80" y="100" width="110" height="90"/>
        <rect x="88" y="108" width="94" height="74" class="s-paper"/>
        <rect x="133" y="108" width="3" height="74"/>
        <rect x="88" y="143" width="94" height="3"/>
      </g>`,
    near: `
      <g transform="translate(230,0)">
        <rect class="s-iron" x="-110" y="236" width="220" height="10"/>
        <rect class="s-iron" x="-104" y="246" width="10" height="14"/>
        <rect class="s-iron" x="94" y="246" width="10" height="14"/>
        <rect class="s-indigo" x="-104" y="222" width="208" height="16" rx="6"/>
        <rect class="s-paper" x="-100" y="210" width="44" height="14" rx="6"/>
        <g transform="translate(30,0)">
          <path class="s-iron" d="M-34,222 L-30,196 L30,196 L34,222 Z"/>
          <rect class="s-glow" x="-26" y="201" width="52" height="17" rx="2"/>
          <circle cx="0" cy="198.6" r="2.2" fill="#3FA85C"/>
        </g>
      </g>`
  },

  "the-open-question": {
    far: `
      <g class="s-faint">
        <circle cx="330" cy="160" r="2"/><circle cx="352" cy="130" r="1.6"/>
        <circle cx="368" cy="186" r="1.8"/><circle cx="344" cy="212" r="1.4"/>
        <circle cx="380" cy="152" r="1.2"/><circle cx="360" cy="236" r="1.5"/>
        <circle cx="390" cy="210" r="1.2"/><circle cx="376" cy="112" r="1.2"/>
      </g>`,
    near: ``
  }
};
