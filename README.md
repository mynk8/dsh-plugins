# dsh-plugins

Plugins and desktop tooling for [DeepSeek Harness](https://github.com/deepseek-harness) (DSH).

| Package | Kind | What it does |
| --- | --- | --- |
| [`@mynk8/dsh-theme-oxocarbon`](packages/theme-oxocarbon) | DSH client plugin | Oxocarbon (IBM Carbon-derived) theme for the DSH web UI, with selectable alternate palettes |
| [`tools/harness-desktop`](tools/harness-desktop) | Desktop tooling | Tray wrapper that supervises a local `dsh web` host and opens the UI in a Chrome app window |

There is **no registry involved**. Plugins install straight from this repository, over
git or from a release tarball.

## Install a plugin

DSH forwards plugin commands to pnpm in the profile directory (`dsh plugin --profile
<name> <pnpm args>`). Point it at this repo:

```bash
dsh plugin --profile web add "github:mynk8/dsh-plugins#path:packages/theme-oxocarbon"
```

That spec is verified to resolve the package as `@mynk8/dsh-theme-oxocarbon`. To make an
install reproducible, pin a commit — the ref and the subdirectory combine with `&`:

```bash
dsh plugin --profile web add "github:mynk8/dsh-plugins#<commit>&path:packages/theme-oxocarbon"
```

DSH appends any profile dependency that declares `dsh.bundle.patch` to
`dsh.profile.bundles` automatically, so nothing else is needed. Bundle layers compose
at boot: restart the `dsh web` host and reload the page.

Working on a plugin from a local clone instead:

```bash
dsh plugin --profile web add link:~/workspace/dsh-plugins/packages/theme-oxocarbon
```

Updating an unpinned git install tracks the default branch:

```bash
dsh plugin --profile web update @mynk8/dsh-theme-oxocarbon
```

### The one rule: one activation route per plugin

A plugin's insert row may come from **either** its bundle patch **or** your profile's
`cordis.patch.yml` — never both. Two layers carrying the same row id compose to two
entries, not one merged entry (verified against `dsh web --dump-config`). If you install
through `dsh plugin add`, leave your profile patch alone; if you hand-wired a row into
`cordis.patch.yml`, do not also add the package to `dsh.profile.bundles`.

## Releases

```bash
./scripts/pack.sh          # packs every package into dist/*.tgz
```

Packed tarballs are the offline and stable-reference route: attach them to a GitHub
release and install from the URL, or hand someone the file.

```bash
dsh plugin --profile web add https://github.com/mynk8/dsh-plugins/releases/download/<tag>/mynk8-dsh-theme-oxocarbon-<version>.tgz
```

`dist/` is gitignored — tarballs are build output, not source.

## Repository layout

```
packages/          DSH plugins (one directory per plugin, each independently consumable)
tools/             desktop tooling that is not a DSH plugin
scripts/           release helpers
```

Every directory under `packages/` is standalone: no build step, no runtime dependency on
a sibling, and installable on its own by the git spec above.

## Secrets

Nothing here needs credentials and none are committed. `.gitignore` excludes `.env*`,
`.npmrc`, keys, certificates and `credentials.json` so a local file cannot be
accidentally included. See `.gitignore` for the full list.
