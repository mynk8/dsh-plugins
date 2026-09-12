/**
 * Token layer + component skin for the DSH web client.
 *
 * Oxocarbon is the active palette. Every value comes from nyoom-engineering's
 * oxocarbon.nvim: base00 #161616, base01..base05 are blends of #161616 toward
 * #ffffff at 0.085 / 0.18 / 0.30 / 0.82 / 0.95 — exactly the ratios that theme
 * computes — and the accents are its base07..base15. Semantic roles follow the
 * theme's own highlight assignments: Normal fg is base04, Pmenu is base01,
 * Visual is base02, Comment is base03, floats use the #131313 `blend`, error
 * is base10, warning is base14, and Directory/Search accents are base08.
 *
 * Bundles in the window.__ModuleLoader__ shape tsdown emits, hand-written so
 * the layer needs no build step. It registers no new theme id: it stacks alias
 * overrides over whichever built-in theme is active, so Light and Dark both
 * follow the palette and the persisted preference keeps working.
 *
 * The component skin is Slack's: 4px controls, 6px cards, 8px dialogs, solid
 * hairline borders instead of alpha or blur, bold control labels, and a
 * bordered composer whose focus state is a single accent hairline. Type is
 * IBM Plex Sans / Mono. Radii live in CSS modules rather than tokens, so they
 * ship as an injected stylesheet; everything else rides tokens.
 */
window.__ModuleLoader__.load({
  id: "@mynk8/dsh-theme-oxocarbon",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
    Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });

    var SOURCE = "dsh-theme-oxocarbon";

    /**
     * Rotate to switch the look: 'oxocarbon', 'slack' or 'everforest'.
     * @type {'oxocarbon' | 'slack' | 'everforest'}
     */
    var ACTIVE = "oxocarbon";

    /**
     * Component radii are hardcoded per CSS module ([hash]_[local]), so the
     * skin needs its own sheet. Three tiers, all !important because every
     * target declares its own radius; pills, dots and avatars (999px / 50%)
     * are deliberately untouched — squaring those reads as broken, not styled.
     */
    var CSS = [
      "/* IBM Plex everywhere, including form controls (they do not inherit). */",
      "body, button, input, textarea, select {",
      "  font-family: 'IBM Plex Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI',",
      "    'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial, sans-serif;",
      "}",
      "/* Tier 1 — controls: Slack fields and buttons are 4px. */",
      "button, input, textarea, select, pre, code,",
      '  [class*="_button"], [class*="Button"], [class*="_input"], [class*="Input"]',
      "  { border-radius: 4px !important; }",
      "/* Tier 2 — cards, menus, list rows, message rows: 6px. */",
      '[role="menu"], [role="listbox"], [role="option"], [role="menuitem"],',
      '  [role="tab"], [role="tabpanel"],',
      '  [class*="_card"], [class*="Card"], [class*="_panel"], [class*="Panel"],',
      '  [class*="_bubble"], [class*="Bubble"], [class*="_menu"], [class*="Menu"],',
      '  [class*="_cell"], [class*="Cell"], [class*="_item"], [class*="_row"],',
      '  [class*="Row"], [class*="_root"], [class*="Root"], [class*="_block"],',
      '  [class*="Block"], [class*="_tab"], [class*="_list"], [class*="List"],',
      '  [class*="_crumb"], [class*="_frame"], [class*="_notice"], [class*="_preview"]',
      "  { border-radius: 6px !important; }",
      "/* Tier 3 — dialogs, popovers, toasts, composers: 8px. */",
      '[role="dialog"], [role="tooltip"],',
      '  [class*="_dialog"], [class*="Dialog"], [class*="_overlay"], [class*="Overlay"],',
      '  [class*="_toast"], [class*="Toast"], [class*="_modal"], [class*="Modal"],',
      '  [class*="_editor"], [class*="Editor"], [class*="_indicator"], [class*="_selector"]',
      "  { border-radius: 8px !important; }",
      "/* Slack control density: 12px side padding and a bold label. */",
      '[class*="_button"] { padding: 0 12px !important; font-weight: 700 !important; }',
      "/* --- Composer: a bordered field, not a floating capsule --- */",
      "[data-composer-card] {",
      "  border-radius: 8px !important;",
      "  box-shadow: 0 0 0 1px var(--dsw-alias-border-l2) !important;",
      "}",
      "/* Focus is one accent hairline — no halo, no bloom. */",
      "[data-composer-card]:focus-within {",
      "  box-shadow: 0 0 0 1px var(--dsh-theme-accent) !important;",
      "}",
      "/* Slack keeps the controls inside a rounded field square. */",
      '[data-composer-card] [class*="_add"],',
      '[data-composer-card] [class*="_select"],',
      '[data-composer-card] [class*="_primary"] { border-radius: 4px !important; }',
      "/* Send is the oxocarbon accent; the square-icon button beside it is Stop. */",
      '[data-composer-card] button[class*="_primary"]:has(path) {',
      "  background: var(--dsh-theme-accent) !important;",
      "  color: var(--dsh-theme-accent-ink) !important;",
      "}",
      '[data-composer-card] button[class*="_primary"]:has(path):hover:not(:disabled) {',
      "  filter: brightness(1.1);",
      "}",
      "/* Code, diff, read, terminal, web and search cards each declare a local",
      "   12px radius that their banner, header and <pre> corners read. Square it",
      "   at the source, or the card's own radius and its corners disagree. */",
      '[class*="_block"] {',
      "  --dsl-code-block-border-radius: 6px !important;",
      "  --dsl-diff-radius: 6px !important;",
      "  --dsl-read-radius: 6px !important;",
      "  --dsl-terminal-radius: 6px !important;",
      "  --dsl-web-radius: 6px !important;",
      "  --dsl-search-radius: 6px !important;",
      "}",
      "/* The markdown code block, keyed off its language banner. */",
      '[class*="_block"]:has([class*="_infostring"]) [class*="_banner"] {',
      "  padding: 8px 12px !important;",
      "}",
      '[class*="_block"]:has([class*="_infostring"]) pre {',
      "  padding: 12px !important;",
      "}",
    ].join("\n");

    var PALETTES = {
      // nyoom-engineering/oxocarbon.nvim, dark and light branches verbatim.
      oxocarbon: {
        dark: {
          scheme: "dark",
          bgDim: "#131313",  // blend — what the theme gives floats
          bg0: "#161616",    // base00
          bg1: "#2a2a2a",    // base01 = blend .085 (CursorLine, Pmenu, VertSplit)
          bg2: "#404040",    // base02 = blend .18  (Visual, PmenuSel)
          bg3: "#5c5c5c",    // base03 = blend .30  (NonText, LineNr)
          bg4: "#7f7f7f",    // blend .45
          fg: "#d5d5d5",     // base04 = blend .82  (Normal fg)
          grey0: "#5c5c5c",  // base03 (Comment)
          grey1: "#8d8d8d",  // theme gray (csvCol2)
          grey2: "#adadad",  // CmpItemAbbr — the completion label gray
          red: "#ee5396",    // base10 (ErrorMsg)
          orange: "#ff7eb6", // base12
          yellow: "#be95ff", // base14 (WarningMsg)
          green: "#42be65",  // base13
          aqua: "#3ddbd9",   // base08 (Directory, PmenuSel fg)
          blue: "#33b1ff",   // base11 (CurSearch bg)
          purple: "#82cfff", // base15
          accent: "#3ddbd9",
          accentInk: "#161616",
          // oxocarbon.nvim's own groups: @keyword/@number base09, @string
          // base14, @function base12, @punctuation.* base08, Comment base03,
          // Identifier/@parameter base04, Number (vim syntax) base15.
          syntax: {
            keyword: "#78a9ff", string: "#be95ff", number: "#82cfff",
            func: "#ff7eb6", param: "#d5d5d5", punct: "#3ddbd9",
            link: "#3ddbd9", comment: "#8d8d8d", variable: "#d5d5d5"
          }
        },
        light: {
          scheme: "light",
          bgDim: "#fafafa",  // blend
          bg0: "#ffffff",    // base00
          bg1: "#f3f3f3",    // base01 = blend .95
          bg2: "#d5d5d5",    // base02 = blend .82
          bg3: "#d5d5d5",    // base02
          bg4: "#b0b0b0",
          fg: "#161616",     // base03 (Normal fg), which is base00 in the light branch
          grey0: "#525252",  // base06
          grey1: "#6f8089",
          grey2: "#90A4AE",  // base05
          red: "#ff6f00",    // base10
          orange: "#ffab91", // base15
          yellow: "#be95ff", // base14
          green: "#42be65",  // base13
          aqua: "#ff7eb6",   // base08
          blue: "#0f62fe",   // base11
          purple: "#673ab7", // base12
          accent: "#0f62fe",
          accentInk: "#ffffff",
          syntax: {
            keyword: "#ee5396", string: "#ff7eb6", number: "#ffab91",
            func: "#673ab7", param: "#161616", punct: "#ff7eb6",
            link: "#ff7eb6", comment: "#525252", variable: "#161616"
          }
        }
      },
      // Slack's own theme, kept for one-line comparison.
      slack: {
        light: {
          scheme: "light",
          bgDim: "#ffffff", bg0: "#ffffff", bg1: "#f8f8f8", bg2: "#f0f0f0", bg3: "#e8e8e8", bg4: "#dddddd",
          fg: "#1d1c1d", grey0: "#616061", grey1: "#868686", grey2: "#ababad",
          red: "#e01e5a", orange: "#e8912d", yellow: "#ecb22e", green: "#007a5a",
          aqua: "#1d9bd1", blue: "#1264a3", purple: "#8e44ad", accent: "#2eb67d", accentInk: "#ffffff"
        },
        dark: {
          scheme: "dark",
          bgDim: "#19171d", bg0: "#1a1d21", bg1: "#222529", bg2: "#2c2d30", bg3: "#383838", bg4: "#565856",
          fg: "#d1d2d3", grey0: "#868686", grey1: "#9b9b9b", grey2: "#ababad",
          red: "#e01e5a", orange: "#e8912d", yellow: "#ecb22e", green: "#2eb67d",
          aqua: "#36c5f0", blue: "#1d9bd1", purple: "#b57edc", accent: "#2eb67d", accentInk: "#19171d"
        }
      },
      // Sainnhe Park's Everforest.
      everforest: {
        light: {
          scheme: "light",
          bgDim: "#f2efdf", bg0: "#fdf6e3", bg1: "#f4f0d9", bg2: "#efebd4", bg3: "#e6e2cc", bg4: "#e0dcc7",
          fg: "#5c6a72", grey0: "#829181", grey1: "#939f91", grey2: "#a6b0a0",
          red: "#f85552", orange: "#f57d26", yellow: "#dfa000", green: "#8da101",
          aqua: "#35a77c", blue: "#3a94c5", purple: "#df69ba", accent: "#8da101", accentInk: "#fdf6e3"
        },
        dark: {
          scheme: "dark",
          bgDim: "#232a2e", bg0: "#2d353b", bg1: "#343f44", bg2: "#3d484d", bg3: "#475258", bg4: "#4f585e",
          fg: "#d3c6aa", grey0: "#7a8478", grey1: "#859289", grey2: "#9da9a0",
          red: "#e67e80", orange: "#e69875", yellow: "#dbbc7f", green: "#a7c080",
          aqua: "#83c092", blue: "#7fbbb3", purple: "#d699b6", accent: "#a7c080", accentInk: "#2d353b"
        }
      }
    };

    /** Parse #rgb / #rrggbb into channel triplets. */
    function rgb(hex) {
      var h = hex.charAt(0) === "#" ? hex.slice(1) : hex;
      if (h.length === 3) h = h.charAt(0) + h.charAt(0) + h.charAt(1) + h.charAt(1) + h.charAt(2) + h.charAt(2);
      return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
    }

    /** Translucent form of a palette color, for masks and washes. */
    function alpha(hex, a) {
      var c = rgb(hex);
      return "rgba(" + c[0] + ", " + c[1] + ", " + c[2] + ", " + a + ")";
    }

    /** Blend a toward b — oxocarbon derives its whole gray ramp this way. */
    function mix(a, b, t) {
      var x = rgb(a), y = rgb(b), out = "#";
      for (var i = 0; i < 3; i++) {
        var v = Math.round(x[i] + (y[i] - x[i]) * t);
        out += (v < 16 ? "0" : "") + v.toString(16);
      }
      return out;
    }

    /** One mode's token values; folded into { light, dark } pairs by tokensFor. */
    function one(p) {
      var dark = p.scheme === "dark";
      var away = dark ? "#ffffff" : "#000000";
      /* Surfaces are separated by solid hairlines, never by alpha or blur.
         The ratios land on oxocarbon's own steps: l1 = base01, l3 = base02,
         l4 = base03 in the dark branch. */
      var line = function (t) { return mix(p.bg0, p.fg, t); };
      var syn = p.syntax || {
        keyword: p.blue, string: p.green, number: p.orange, func: p.purple,
        param: p.fg, punct: p.grey1, link: p.blue, comment: p.grey0, variable: p.fg
      };
      return {
        "--dsw-alias-bg-base": p.bg0,
        "--dsw-alias-bg-layer-1": p.bg1,
        "--dsw-alias-bg-layer-2": mix(p.bg0, p.fg, 0.13),
        "--dsw-alias-bg-layer-3": p.bg2,
        "--dsw-alias-bg-module-platform": p.bg2,
        "--dsw-alias-bg-multi-select": p.bg2,
        "--dsw-alias-bg-overlay": p.bg2,
        "--dsw-alias-bg-skeleton": alpha(p.fg, 0.08),
        "--dsw-alias-bg-mask-1": alpha(p.bg0, dark ? 0.5 : 0.24),
        "--dsw-alias-bg-mask-2": alpha(p.bg0, dark ? 0.2 : 0.12),
        "--dsw-alias-bg-mask-3": alpha(p.bg0, 0.48),
        "--dsw-alias-bg-mask-photo": alpha(p.bg0, 0.88),
        "--dsw-alias-bg-mask-drop": alpha(p.bg0, 0.7),

        "--dsw-alias-border-inverted": line(dark ? 0.105 : 0),
        "--dsw-alias-border-inverted2": line(dark ? 0.16 : 0),
        "--dsw-alias-border-l1": line(0.105),
        "--dsw-alias-border-l2-darkmode-thin": line(0.105),
        "--dsw-alias-border-l2": line(0.16),
        "--dsw-alias-border-l3": line(0.22),
        "--dsw-alias-border-l4": line(0.366),

        "--dsw-alias-brand-primary": p.fg,
        "--dsw-alias-brand-primary-invert": p.bg0,
        "--dsw-alias-brand-text": p.fg,
        "--dsw-alias-brand-primary-new-colorprimary-new-color": p.accent,

        "--dsw-alias-button-contrast-fill": p.fg,
        "--dsw-alias-button-elevated-fill": p.bg1,
        "--dsw-alias-button-floating-fill": p.bg1,
        "--dsw-alias-button-floating-hover": p.bg1,
        "--dsw-alias-button-ghost-active-border": p.grey0,
        "--dsw-alias-button-ghost-active-fill": p.bg1,
        "--dsw-alias-button-ghost-active-hover": p.bg2,
        "--dsw-alias-button-info-fill": p.blue,
        "--dsw-alias-button-info-hover": mix(p.blue, away, 0.15),
        "--dsw-alias-button-primary-dimmed": p.bg1,
        "--dsw-alias-button-primary-fill": p.fg,
        "--dsw-alias-button-primary-hover": mix(p.fg, p.bg0, 0.15),
        "--dsw-alias-button-tool-bar-fill": alpha(p.fg, dark ? 0.4 : 0.5),
        "--dsw-alias-button-tool-bar-fill-invisible": alpha(p.fg, dark ? 0.28 : 0.36),
        "--dsw-alias-button-tool-bar-hover": alpha(p.fg, dark ? 0.5 : 0.6),

        "--dsw-alias-interactive-bg-active": alpha(p.fg, 0.14),
        "--dsw-alias-interactive-bg-hover": alpha(p.fg, dark ? 0.08 : 0.06),
        "--dsw-alias-interactive-bg-hover-accent": alpha(p.accent, dark ? 0.16 : 0.14),
        "--dsw-alias-interactive-bg-hover-danger": alpha(p.red, dark ? 0.16 : 0.08),
        "--dsw-alias-interactive-bg-hover-solid": p.bg1,

        "--dsw-alias-label-caption": dark ? p.grey0 : p.grey2,
        "--dsw-alias-label-dimmed": dark ? p.grey1 : p.grey2,
        "--dsw-alias-label-primary": p.fg,
        "--dsw-alias-label-primary-bluish": p.fg,
        "--dsw-alias-label-primary-dimmed": mix(p.fg, away, 0.12),
        "--dsw-alias-label-primary-foreground": p.bgDim,
        "--dsw-alias-label-primary-inverted": p.bg0,
        "--dsw-alias-label-secondary": dark ? p.grey2 : p.grey0,
        "--dsw-alias-label-tertiary": p.grey1,
        "--dsw-alias-link": p.blue,

        /* shiki's css-variables theme reads these, and its sheet declares
           literal hexes rather than tokens, so the palette has to arrive here. */
        "--shiki-foreground": p.fg,
        "--shiki-background": dark ? p.bgDim : p.bg1,
        "--shiki-token-constant": syn.number,
        "--shiki-token-string": syn.string,
        "--shiki-token-comment": syn.comment,
        "--shiki-token-keyword": syn.keyword,
        "--shiki-token-parameter": syn.param,
        "--shiki-token-function": syn.func,
        "--shiki-token-string-expression": syn.string,
        "--shiki-token-punctuation": syn.punct,
        "--shiki-token-link": syn.link,

        "--dsw-alias-markdown-citation": p.bg1,
        "--dsw-alias-markdown-code-block": dark ? p.bgDim : p.bg1,
        "--dsw-alias-markdown-code-block-banner": p.bg1,
        "--dsw-alias-markdown-code-segment-selected": p.bg1,
        "--dsw-alias-markdown-code-segment-unselected": p.bg0,
        "--dsw-alias-markdown-inline-code": p.bg1,
        "--dsw-alias-markdown-placeholder": p.bg1,
        "--dsw-alias-markdown-tag": p.bg1,

        "--dsw-alias-scrollbar-bg-l1": p.bg1,
        "--dsw-alias-scrollbar-bg-l2": p.bg1,
        "--dsw-alias-scrollbar-hover-l1": p.bg3,
        "--dsw-alias-scrollbar-hover-l2": p.bg3,

        "--dsw-alias-state-business-primary": p.aqua,
        "--dsw-alias-state-business-tertiary": mix(p.bg0, p.aqua, dark ? 0.18 : 0.14),
        "--dsw-alias-state-error-primary": p.red,
        "--dsw-alias-state-error-secondary": p.red,
        "--dsw-alias-state-success-primary": p.green,
        "--dsw-alias-state-success-secondary": p.aqua,
        "--dsw-alias-state-success-tertiary": mix(p.bg0, p.green, dark ? 0.18 : 0.14),
        "--dsw-alias-state-warn-label": p.yellow,
        "--dsw-alias-state-warn-primary": p.yellow,
        "--dsw-alias-state-warn-secondary": p.orange,
        "--dsw-alias-state-warn-tertiary": mix(p.bg0, p.yellow, dark ? 0.18 : 0.14),

        "--dsw-alias-toast-bg": dark ? p.bg2 : p.fg,
        "--dsw-alias-tooltip-bg": dark ? p.bg2 : p.fg,

        "--dsw-specific-bubble": mix(p.bg1, p.accent, dark ? 0.08 : 0.1),
        "--dsw-specific-bubble-highlight": mix(p.bg1, p.accent, dark ? 0.16 : 0.2),
        "--dsw-specific-input-major": p.bg1,
        "--dsw-specific-login-input": dark ? p.bg0 : p.bg1,
        "--dsw-specific-menu": p.bg1,
        "--dsw-specific-selector": p.bg1,
        "--dsw-specific-sidebar-fill": p.bgDim,
        "--dsw-specific-sidebar-nav-item-active": p.bg2,
        "--dsw-specific-sidebar-nav-item-active-accent": mix(p.bg1, p.accent, dark ? 0.14 : 0.18),
        "--dsw-specific-sidebar-nav-item-hover": p.bg1,
        "--dsw-specific-tip": p.bg1,

        /* --- elevation: flat, hairline-only --- */
        "--dsw-corner-shape": "round",
        "--dsw-elevation-stroke-color": line(0.22),
        "--dsw-shadow-lv1": "0 0 0 1px " + line(0.105),
        "--dsw-shadow-lv1-blur": "0 0 0 1px " + line(0.105),
        "--dsw-shadow-lv2": "0 0 0 1px " + line(0.16),
        "--dsw-shadow-lv3": "0 0 0 1px " + line(0.22)
          + ", 0 4px 12px 0 rgba(0, 0, 0, " + (dark ? 0.5 : 0.12) + ")",
        "--dsw-linear-gradient-think": "linear-gradient(180deg, " + p.bg0 + " 20.19%, " + alpha(p.bg0, 0) + " 100%)",
        "--dsw-linear-think-select": "linear-gradient(180deg, " + p.bg1 + " 20.19%, " + alpha(p.bg1, 0) + " 100%)",

        /* --- typography: IBM Plex, host-installed --- */
        "--dsw-font-family": "'IBM Plex Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial, sans-serif",
        "--ds-font-family-code": "'IBM Plex Mono', 'SF Mono', Menlo, Consolas, 'Courier New', 'PingFang SC', 'Microsoft YaHei'",
        "--ds-transition-duration": "0.15s",
        "--ds-transition-duration-fast": "0.08s",

        /* --- the composer CTA reads these, so it follows the palette --- */
        "--dsh-theme-accent": p.accent,
        "--dsh-theme-accent-ink": p.accentInk,

        /* --- the raw palette some components read directly --- */
        "--dsw-static-deepseek-200": mix(p.accent, away, 0.5),
        "--dsw-static-deepseek-450": p.accent,
        "--dsw-static-deepseek-500": p.accent,
        "--dsw-static-blue-400": p.blue,
        "--dsw-static-blue-450": p.blue,
        "--dsw-static-blue-500": p.accent,
        "--dsw-static-green-500": p.green,
        "--dsw-static-amber-400": p.orange,
        "--dsw-static-amber-500": p.yellow,
        "--dsw-static-red-600": p.red,
        "--dsw-static-neutral-bluish-00": dark ? p.fg : "#ffffff",
        "--dsw-static-neutral-bluish-300": dark ? p.grey2 : p.grey1,
        "--dsw-static-neutral-bluish-400": dark ? p.grey1 : p.grey0,
        "--dsw-static-neutral-00": dark ? p.fg : "#ffffff",
        "--dsw-static-neutral-50": dark ? mix(p.bg0, p.fg, 0.05) : p.bgDim,
        "--dsw-static-neutral-100": dark ? mix(p.bg0, p.fg, 0.09) : p.bg1,
        "--dsw-static-neutral-200": mix(p.bg0, p.fg, 0.1),
        "--dsw-static-neutral-400": p.grey1,
        "--dsw-static-neutral-700": mix(p.bg0, p.fg, 0.22),
        "--dsw-static-neutral-800": dark ? mix(p.bg0, p.fg, 0.09) : line(0.22),
        "--dsw-static-neutral-850": dark ? mix(p.bg0, p.fg, 0.05) : p.bg1
      };
    }

    /** Fold one({light}) and one({dark}) into the { light, dark } token pairs. */
    function tokensFor(palette) {
      var l = one(palette.light), d = one(palette.dark), out = {};
      for (var name in l) out[name] = { light: l[name], dark: d[name] };
      return out;
    }

    /** The ui-theme service owns the registry; this layer only stacks on it. */
    var inject = ["theme"];

    /**
     * Stack the active palette plus the component skin over the live theme.
     * @param ctx - Client root context.
     */
    function apply(ctx, config) {
      var name = config != null && typeof config.palette === "string" ? config.palette : ACTIVE;
      var palette = Object.prototype.hasOwnProperty.call(PALETTES, name) ? PALETTES[name] : PALETTES[ACTIVE];
      ctx.theme.overrideTokens(SOURCE, tokensFor(palette));
      if (typeof document === "undefined") return;
      var tag = document.querySelector("style[data-dsh-theme-layer=\"" + SOURCE + "\"]");
      if (tag === null) {
        tag = document.createElement("style");
        tag.dataset.dshThemeLayer = SOURCE;
        document.head.appendChild(tag);
      }
      tag.textContent = CSS;
    }

    exports.apply = apply;
    exports.inject = inject;
    return module.exports;
  }
});
