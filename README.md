# dsh-plugins

Plugins and desktop tooling for [DeepSeek Harness](https://github.com/deepseek-harness) (DSH).

| Package | Kind | What it does |
| --- | --- | --- |
| [`@mynk8/dsh-theme-oxocarbon`](packages/theme-oxocarbon) | DSH client plugin | Oxocarbon (IBM Carbon-derived) theme for the DSH web UI, with selectable alternate palettes |
| [`tools/harness-desktop`](tools/harness-desktop) | Desktop tooling | Tray wrapper that supervises a local `dsh web` host and opens the UI in a Chrome app window |

## Install a plugin

DSH installs profile plugins through its own pnpm forwarder. A package that declares
`dsh.bundle` is appended to `dsh.profile.bundles` automatically, so installation is
one command:

```bash
dsh plugin --profile web add @mynk8/dsh-theme-oxocarbon
```

Bundle layers are composed at boot, so restart the `dsh web` host and reload the page
to see the theme.

### The one rule: one activation route per plugin

A plugin's insert row may come from **either** its bundle patch **or** your profile's
`cordis.patch.yml` — never both. Two layers carrying the same row id compose to two
entries, not one merged entry. If you install through `dsh plugin add`, leave your
profile patch alone; if you hand-wired a row into `cordis.patch.yml`, do not also add
the package to `dsh.profile.bundles`.

## Repository layout

```
packages/          DSH plugins (one directory per plugin, each independently publishable)
tools/             desktop tooling that is not a DSH plugin
```

Every directory under `packages/` is a standalone package: it has no build step, no
runtime dependency on a sibling, and can be published or consumed on its own.

## Secrets

Nothing in this repository requires credentials, and none are committed. Publishing
tokens are read from your environment or `~/.npmrc` outside the working tree; see
`.gitignore` for the patterns that are excluded by default.
