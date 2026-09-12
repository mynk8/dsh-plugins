# @mynk8/dsh-theme-oxocarbon

An [Oxocarbon](https://github.com/nyoom-engineering/oxocarbon.nvim) theme for the
DeepSeek Harness web UI. It is a client plugin: it stacks semantic alias overrides
over whichever built-in theme is active, then adds a component skin (radii, solid
hairline borders, IBM Plex type, a squared-off composer). The host half is a no-op —
there is no host state, no service, and no build step.

## Install

```bash
dsh plugin --profile web add @mynk8/dsh-theme-oxocarbon
```

DSH appends any profile dependency that declares `dsh.bundle.patch` to
`dsh.profile.bundles`, so this is the whole install. Bundle layers compose at boot:
restart the `dsh web` host and reload the page.

### The one rule: never activate it twice

The plugin's insert row may come from its **bundle patch** *or* from a hand-written
row in a profile's `cordis.patch.yml` — not both. Two layers carrying the same row id
compose to **two entries, not one merged entry** (verified against `dsh web
--dump-config`), and the plugin would mount twice.

A hand-written row is the way to run a development copy, because the profile patch is
watched live — `patchReload: live` remounts it without restarting the host:

```yaml
- insert:
    - id: theme-oxocarbon
      name: "@mynk8/dsh-theme-oxocarbon"
```

If you wire that row by hand, do not also add the package to `dsh.profile.bundles`.

## Palettes

Oxocarbon is the default. Three palettes ship in the bundle; pick one with an
id-targeted config override in your profile's `cordis.patch.yml`:

```yaml
- id: theme-oxocarbon
  config:
    palette: slack
```

| `config.palette` | Look |
| --- | --- |
| `oxocarbon` (default) | IBM Carbon-derived: teal accent `#3ddbd9` on `#161616`, pink/purple/green syntax |
| `slack` | Slack-derived dark surfaces with an aubergine-tinted base and a green accent |
| `everforest` | The original Everforest base16 palette this package started from |

Every palette defines exactly the same token set, so switching never leaves a gap. An
unknown or malformed value falls back to oxocarbon rather than throwing — the plugin
must never break the UI it is theming.

## What it overrides

- **~136 alias tokens** — backgrounds, borders, labels, sidebar and input fills,
  elevation strokes, fonts, transition durations, and the shiki syntax colours used by
  code blocks.
- **Static brand colours** — the `--dsw-static-*` tokens the UI uses in gradients and
  status shimmer, so no DeepSeek blue bleeds through a warm palette.
- **A CSS layer** — control/card/dialog radii (4/6/8px), a squared composer with a
  single accent hairline on focus, and IBM Plex Sans/Mono typography with CJK
  fallbacks.

## Design provenance

Colours are taken from `oxocarbon.nvim`'s own palette and highlight assignments, not
eyeballed: `Normal` foreground is base04, `Pmenu` is base01, `Visual` is base02,
floats use the `#131313` blend, `ErrorMsg` is base10, `WarningMsg` is base14, and
`Directory`/`Search` accents are base08.

One deliberate divergence: syntax **comments** are lifted to `#8d8d8d` in dark
(~5.6:1 on base00) instead of oxocarbon's literal base03 `#5c5c5c` (~2.8:1), which is
below the contrast floor for code on a dark background. Light mode uses `#525252`
(~7:1). Everything else follows the palette.

## Verify

```bash
node test/smoke.mjs
```

The test loads `client.js` through `window.__ModuleLoader__` with a stub theme service
and asserts the module face, that the bundle id matches the package name, that every
token is a `{ light, dark }` string pair, that all three palettes define the same token
set, that unknown and malformed configs fall back, and that the stylesheet layer is
appended exactly once.

## Uninstall

```bash
dsh plugin --profile web remove @mynk8/dsh-theme-oxocarbon
```

## Credits and licence

MIT. The Oxocarbon palette is by [nyoom-engineering](https://github.com/nyoom-engineering/oxocarbon.nvim)
(MIT); Everforest is by [sainnhe](https://github.com/sainnhe/everforest) (MIT). Type is
IBM Plex, which the theme references but does not bundle.
